import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { db } from "@/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("Payment succeeded:", paymentIntent.id)

      // Check if this is a trainer activation payment
      if (paymentIntent.metadata?.type === "trainer_activation" && paymentIntent.metadata?.tempId) {
        console.log("Processing trainer activation for tempId:", paymentIntent.metadata.tempId)
        await activateTrainer(paymentIntent.metadata.tempId, paymentIntent.id)
      }
      break

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log("Payment failed:", failedPayment.id)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function activateTrainer(tempId: string, paymentIntentId: string) {
  try {
    console.log("Activating trainer:", { tempId, paymentIntentId })

    // Get the temp trainer document
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerDoc = await getDoc(tempTrainerRef)

    if (!tempTrainerDoc.exists()) {
      console.error("Temp trainer not found:", tempId)
      return
    }

    const tempTrainerData = tempTrainerDoc.data()
    console.log("Found temp trainer:", tempTrainerData)

    // Generate AI content for the trainer
    const generatedContent = await generateTrainerContent(tempTrainerData)

    // Update the trainer document with activation
    await updateDoc(tempTrainerRef, {
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId: paymentIntentId,
      activatedAt: new Date().toISOString(),
      content: generatedContent,
    })

    console.log("Trainer activated successfully:", tempId)
  } catch (error) {
    console.error("Error activating trainer:", error)
  }
}

async function generateTrainerContent(trainerData: any) {
  // Generate AI content based on trainer data
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${trainerData.specialty || "Fitness Specialist"} • ${trainerData.experience || "Professional"} • ${trainerData.location || "Available"}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${trainerData.fullName || "Your Trainer"}`,
      content: `${trainerData.bio || "Dedicated fitness professional committed to helping you achieve your goals through personalized training and nutrition guidance."}`,
    },
    services: trainerData.services || [
      {
        name: "Personal Training",
        description: "One-on-one training sessions tailored to your goals",
      },
      {
        name: "Nutrition Coaching",
        description: "Personalized meal plans and nutrition guidance",
      },
      {
        name: "Group Classes",
        description: "Fun and motivating group fitness sessions",
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone,
      location: trainerData.location,
    },
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results! Highly recommend this trainer.",
        rating: 5,
      },
      {
        name: "John D.",
        text: "Professional, knowledgeable, and motivating.",
        rating: 5,
      },
    ],
  }

  return content
}
