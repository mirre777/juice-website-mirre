import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/lib/logger"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
})

// Your webhook secret from the Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

// Simple in-memory cache for processed events (in production, use a database)
const processedEvents = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Log the received event
    console.log(`Webhook received: ${event.type} | ID: ${event.id}`)

    // Check for idempotency - have we processed this event before?
    if (processedEvents.has(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`)
      return NextResponse.json({ received: true, status: "already_processed" })
    }

    // Handle specific event types
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
          break

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
          break

        case "customer.subscription.created":
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break

        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
          break

        // Add more event handlers as needed

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      // Mark this event as processed
      processedEvents.add(event.id)

      console.log(`Successfully processed event: ${event.type} | ID: ${event.id}`)

      // Return a 200 response to acknowledge receipt of the event
      return NextResponse.json({ received: true, status: "processed" })
    } catch (error: any) {
      console.error(`Error processing webhook event ${event.id}: ${error.message}`)
      console.error(error.stack)

      // For most errors, we'll still return 200 to acknowledge receipt
      // This prevents Stripe from retrying events that will always fail
      return NextResponse.json({ received: true, status: "error", message: error.message }, { status: 200 })
    }
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

// Handler for successful payment intents
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment succeeded:", paymentIntent.id)

    // Extract customer information
    const customerId = paymentIntent.customer as string
    const amount = paymentIntent.amount
    const email = paymentIntent.receipt_email
    const metadata = paymentIntent.metadata

    // Extract plan information from metadata
    const planId = metadata.plan || "unknown"
    const planType = metadata.planType || "Unknown Plan"
    const userEmail = metadata.userEmail || email || "unknown"

    // NEW: Extract tempId from metadata for trainer activation
    const tempId = metadata.tempId

    // Log detailed information
    console.log({
      event: "payment_succeeded",
      paymentId: paymentIntent.id,
      customerId,
      amount,
      email: userEmail,
      metadata,
      plan: planId,
      planType: planType,
      tempId: tempId,
      status: "succeeded",
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    })

    // NEW: Handle trainer activation if tempId is present
    if (tempId && amount === 2900) {
      // €29.00 in cents
      try {
        await activateTrainer(tempId, paymentIntent.id)
        console.log("Trainer activated successfully", { tempId, paymentIntentId: paymentIntent.id })
      } catch (activationError) {
        console.error("Failed to activate trainer", {
          tempId,
          paymentIntentId: paymentIntent.id,
          error: activationError instanceof Error ? activationError.message : String(activationError),
        })
        // Don't throw here - we still want to acknowledge the payment
      }
    }
  } catch (error) {
    console.error("Error handling payment intent success:", error)
    throw error
  }
}

// NEW: Trainer activation function
async function activateTrainer(tempId: string, paymentIntentId: string): Promise<void> {
  try {
    logger.info("Starting trainer activation", { tempId, paymentIntentId })

    // Get temp trainer document
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      throw new Error(`Temp trainer not found: ${tempId}`)
    }

    const tempTrainerData = tempTrainerSnap.data()

    // Check if already activated
    if (tempTrainerData.isActive && tempTrainerData.isPaid) {
      logger.info("Trainer already activated", { tempId })
      return
    }

    // Generate AI content for permanent profile
    const generatedContent = generateTrainerContent(tempTrainerData)

    // Create final trainer profile with generated content
    const finalTrainerData = {
      // Basic trainer info
      fullName: tempTrainerData.fullName,
      name: tempTrainerData.fullName,
      email: tempTrainerData.email,
      phone: tempTrainerData.phone,
      location: tempTrainerData.location,
      specialty: tempTrainerData.specialty,
      specialization: tempTrainerData.specialty,
      experience: tempTrainerData.experience,
      bio: tempTrainerData.bio,
      certifications: tempTrainerData.certifications || [],

      // Status and payment info
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,

      // Add generated content
      content: generatedContent,

      // Timestamps
      createdAt: tempTrainerData.createdAt,
      activatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Add final trainer document
    const finalTrainerRef = await addDoc(collection(db, "trainers"), finalTrainerData)
    const finalId = finalTrainerRef.id

    // Update temp document with final ID and activation status
    await updateDoc(tempTrainerRef, {
      finalId,
      isActive: true,
      isPaid: true,
      paymentIntentId,
      activatedAt: serverTimestamp(),
      status: "activated", // Change from "temp" to "activated"
    })

    logger.info("Trainer activation completed successfully", {
      tempId,
      finalId,
      email: tempTrainerData.email,
      paymentIntentId,
    })
  } catch (error) {
    logger.error("Error in trainer activation", {
      tempId,
      paymentIntentId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

// Content generation function
function generateTrainerContent(trainerData: any) {
  const name = trainerData.fullName || trainerData.name
  const specialty = trainerData.specialty || trainerData.specialization
  const location = trainerData.location
  const experience = trainerData.experience
  const bio = trainerData.bio

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialty} Training • ${experience} Experience`,
      description: `Welcome! I'm ${name}, a certified personal trainer specializing in ${specialty}. With ${experience} of experience in ${location}, I'm here to help you achieve your fitness goals through personalized training programs that deliver real results.`,
    },
    about: {
      title: "About Me",
      content:
        bio ||
        `I'm ${name}, a passionate fitness professional with ${experience} of experience in ${specialty}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.\n\nMy approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.\n\nI'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`,
    },
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: `One-on-one personalized ${specialty.toLowerCase()} training session focused on your specific goals`,
        price: 60,
        duration: "60 minutes",
        featured: true,
      },
      {
        id: "2",
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation and goal-setting session",
        price: 40,
        duration: "45 minutes",
        featured: false,
      },
      {
        id: "3",
        title: "Custom Workout Plan",
        description: `Personalized ${specialty.toLowerCase()} program designed for your goals and schedule`,
        price: 80,
        duration: "Digital delivery",
        featured: false,
      },
    ],
    contact: {
      title: "Let's Start Your Fitness Journey",
      description: `Ready to transform your fitness with professional ${specialty.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`,
      email: trainerData.email,
      phone: trainerData.phone || "",
      location: location,
    },
    seo: {
      title: `${name} - Personal Trainer in ${location}`,
      description: `Professional ${specialty} training with ${name}. Transform your fitness with personalized programs in ${location}. ${experience} of experience.`,
    },
    version: 1,
    lastModified: new Date().toISOString(),
  }
}

// Handler for failed payment intents
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id)

    // Extract information
    const customerId = paymentIntent.customer as string
    const amount = paymentIntent.amount
    const email = paymentIntent.receipt_email
    const lastError = paymentIntent.last_payment_error

    // Log detailed information about the failure
    console.log({
      event: "payment_failed",
      paymentId: paymentIntent.id,
      customerId,
      amount,
      email,
      errorMessage: lastError ? lastError.message : "Unknown error",
      errorCode: lastError ? lastError.code : null,
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Error handling payment intent failure:", error)
    throw error
  }
}

// Handler for subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log("Subscription created:", subscription.id)

    // Extract information
    const customerId = subscription.customer as string
    const status = subscription.status
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    const items = subscription.items.data

    // Get the product and price details from the first item
    const productId = items[0]?.price.product as string
    const priceId = items[0]?.price.id
    const amount = items[0]?.price.unit_amount

    // Log detailed information
    console.log({
      event: "subscription_created",
      subscriptionId: subscription.id,
      customerId,
      status,
      productId,
      priceId,
      amount,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      createdAt: new Date(subscription.created * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Error handling subscription creation:", error)
    throw error
  }
}

// Handler for completed checkout sessions
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("Checkout session completed:", session.id)

    // Extract customer information
    const customerId = session.customer as string
    const amount = session.amount_total
    const email = session.customer_email
    const metadata = session.metadata

    // Log detailed information
    console.log({
      event: "checkout_completed",
      sessionId: session.id,
      customerId,
      amount,
      email,
      metadata,
      status: "completed",
      createdAt: new Date(session.created * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Error handling checkout session completion:", error)
    throw error
  }
}
