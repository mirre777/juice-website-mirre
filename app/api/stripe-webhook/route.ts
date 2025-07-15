import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    logger.error("Webhook signature verification failed", { error: err })
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  logger.info("Stripe webhook received", { type: event.type, id: event.id })

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        logger.info("Unhandled webhook event type", { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error("Webhook processing error", {
      error: error instanceof Error ? error.message : String(error),
      eventType: event.type,
      eventId: event.id,
    })
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  logger.info("Processing successful payment", {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    metadata: paymentIntent.metadata,
  })

  // Check if this is a trainer activation payment
  const tempId = paymentIntent.metadata?.tempId
  if (tempId) {
    logger.info("Trainer activation payment detected", { tempId, paymentIntentId: paymentIntent.id })
    await activateTrainer(tempId, paymentIntent.id)
  }

  // Update payment intent status in database if needed
  try {
    const paymentRef = doc(db, "payments", paymentIntent.id)
    await updateDoc(paymentRef, {
      status: "succeeded",
      updatedAt: new Date(),
    })
  } catch (error) {
    logger.warn("Failed to update payment status", { paymentIntentId: paymentIntent.id, error })
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  logger.info("Processing failed payment", {
    paymentIntentId: paymentIntent.id,
    lastPaymentError: paymentIntent.last_payment_error,
  })

  // Update payment intent status in database
  try {
    const paymentRef = doc(db, "payments", paymentIntent.id)
    await updateDoc(paymentRef, {
      status: "failed",
      error: paymentIntent.last_payment_error?.message || "Payment failed",
      updatedAt: new Date(),
    })
  } catch (error) {
    logger.warn("Failed to update payment status", { paymentIntentId: paymentIntent.id, error })
  }
}

async function activateTrainer(tempId: string, paymentIntentId: string) {
  try {
    logger.info("Starting trainer activation", { tempId, paymentIntentId })

    // Get the temporary trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      throw new Error(`Temporary trainer not found: ${tempId}`)
    }

    const tempTrainerData = tempTrainerSnap.data()
    logger.info("Retrieved temp trainer data", { tempId, status: tempTrainerData.status })

    // Generate AI content for the trainer
    const content = await generateTrainerContent(tempTrainerData)

    // Create the final trainer document
    const finalTrainerData = {
      ...tempTrainerData,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,
      content,
      activatedAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to the trainers collection with the same ID
    await setDoc(tempTrainerRef, finalTrainerData)

    logger.info("Trainer activated successfully", {
      tempId,
      paymentIntentId,
      finalId: tempId,
    })

    return { success: true, finalId: tempId }
  } catch (error) {
    logger.error("Trainer activation failed", {
      tempId,
      paymentIntentId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function generateTrainerContent(trainerData: any) {
  const { fullName, specialty, experience, bio, location } = trainerData

  // Generate comprehensive content for the trainer
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialty} • ${experience} • ${location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${fullName}`,
      content:
        bio || `Passionate fitness professional dedicated to helping clients achieve their goals through ${specialty}.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "From €60/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for a more social and cost-effective approach.",
        price: "From €25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with personalized workout plans and nutrition guidance.",
        price: "From €40/session",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Highly recommend.",
        rating: 5,
      },
      {
        name: "John D.",
        text: "Professional, knowledgeable, and motivating trainer.",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone,
      location: location,
    },
    seo: {
      title: `${fullName} - ${specialty} in ${location}`,
      description: `Professional ${specialty} in ${location}. ${experience} of experience helping clients achieve their fitness goals.`,
      keywords: [specialty.toLowerCase(), "personal trainer", location.toLowerCase(), "fitness", "coaching"],
    },
  }

  return content
}
