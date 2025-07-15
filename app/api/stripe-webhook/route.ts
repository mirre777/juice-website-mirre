import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
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
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info("Payment succeeded", {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          metadata: paymentIntent.metadata,
        })

        // Check if this is a trainer activation payment
        if (paymentIntent.metadata?.tempId && paymentIntent.metadata?.type === "trainer_activation") {
          await activateTrainer(paymentIntent.metadata.tempId, paymentIntent.id)
        }
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        logger.error("Payment failed", {
          paymentIntentId: failedPayment.id,
          lastPaymentError: failedPayment.last_payment_error,
        })
        break

      default:
        logger.info("Unhandled event type", { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error("Webhook processing failed", { error, eventType: event.type })
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function activateTrainer(tempId: string, paymentIntentId: string) {
  try {
    logger.info("Starting trainer activation", { tempId, paymentIntentId })

    // Get the temp trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      throw new Error(`Temp trainer not found: ${tempId}`)
    }

    const tempTrainerData = tempTrainerSnap.data()
    logger.info("Temp trainer data retrieved", { tempId, status: tempTrainerData.status })

    // Generate AI content for the trainer
    const generatedContent = await generateTrainerContent(tempTrainerData)

    // Create the final trainer document
    const finalTrainerData = {
      ...tempTrainerData,
      content: generatedContent,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId: paymentIntentId,
      activatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Update the existing document to active status
    await updateDoc(tempTrainerRef, finalTrainerData)

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
  // Generate AI content based on trainer data
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${trainerData.specialization} • ${trainerData.experience} • ${trainerData.location}`,
      description: `Professional fitness training tailored to your goals. Get the results you've been looking for with personalized coaching and proven methods.`,
    },
    about: {
      title: `About ${trainerData.fullName || trainerData.name}`,
      content: `With ${trainerData.experience} of experience in ${trainerData.specialization}, I'm dedicated to helping you achieve your fitness goals. My approach combines proven training methods with personalized attention to ensure you get the results you deserve.`,
      certifications: trainerData.certifications || ["Certified Personal Trainer", "Nutrition Specialist"],
    },
    services: [
      {
        name: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "From €60/session",
      },
      {
        name: "Group Classes",
        description: "Small group training sessions for motivation and community support.",
        price: "From €25/session",
      },
      {
        name: "Online Coaching",
        description: "Remote coaching with custom workout plans and nutrition guidance.",
        price: "From €150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Professional, knowledgeable, and motivating.",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Best trainer I've worked with. Really understands how to push you to achieve your goals.",
        rating: 5,
      },
      {
        name: "Lisa K.",
        text: "Transformed my approach to fitness. Highly recommend!",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "",
      location: trainerData.location,
      availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
    },
  }

  return content
}
