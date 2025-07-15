import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

async function generateTrainerContent(trainerData: any) {
  // Generate AI content for the trainer
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${trainerData.specialization} • ${trainerData.experience} • ${trainerData.location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${trainerData.fullName || trainerData.name}`,
      content: `With ${trainerData.experience} of experience as a ${trainerData.specialization}, I'm dedicated to helping you achieve your fitness goals. My personalized approach combines proven training methods with nutritional guidance to deliver real, lasting results.`,
      certifications: trainerData.certifications || ["Certified Personal Trainer", "Nutrition Specialist"],
    },
    services: trainerData.services || [
      {
        name: "Personal Training",
        description: "One-on-one training sessions tailored to your goals",
        price: "€80/session",
      },
      {
        name: "Group Classes",
        description: "Small group training for motivation and community",
        price: "€25/session",
      },
      {
        name: "Nutrition Coaching",
        description: "Personalized meal plans and nutritional guidance",
        price: "€60/session",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Highly recommend.",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating trainer.",
        rating: 5,
      },
      {
        name: "Lisa K.",
        text: "Best investment I've made for my health and fitness.",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "Contact for details",
      location: trainerData.location,
    },
  }

  return content
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.error("No Stripe signature found")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const tempId = paymentIntent.metadata.tempId

      console.log("Payment succeeded for tempId:", tempId)

      if (tempId) {
        // Activate the trainer
        console.log("Activating trainer with tempId:", tempId)

        // Get temp trainer data
        const tempTrainerRef = db.collection("trainers").doc(tempId)
        const tempTrainerDoc = await tempTrainerRef.get()

        if (!tempTrainerDoc.exists) {
          console.error("Temp trainer not found:", tempId)
          return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
        }

        const tempTrainerData = tempTrainerDoc.data()

        // Generate AI content
        const generatedContent = await generateTrainerContent(tempTrainerData)

        // Create final trainer document
        const finalTrainerData = {
          ...tempTrainerData,
          status: "active",
          isActive: true,
          isPaid: true,
          paymentIntentId: paymentIntent.id,
          activatedAt: new Date().toISOString(),
          content: generatedContent,
        }

        // Create new active trainer document
        const activeTrainerRef = db.collection("trainers").doc()
        await activeTrainerRef.set(finalTrainerData)

        console.log("Trainer activated successfully:", activeTrainerRef.id)

        // Delete temp trainer
        await tempTrainerRef.delete()

        console.log("Temp trainer deleted:", tempId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
