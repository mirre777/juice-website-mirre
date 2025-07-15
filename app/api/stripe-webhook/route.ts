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

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const { tempId } = paymentIntent.metadata

    if (tempId) {
      console.log("Activating trainer:", tempId)

      try {
        // Get temp trainer data
        const tempDoc = await db.collection("trainers").doc(tempId).get()

        if (!tempDoc.exists) {
          console.error("Temp trainer not found:", tempId)
          return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
        }

        const tempData = tempDoc.data()!

        // Generate AI content for the trainer
        const aiContent = await generateTrainerContent(tempData)

        // Create new active trainer document
        const newTrainerRef = db.collection("trainers").doc()
        const finalId = newTrainerRef.id

        await newTrainerRef.set({
          ...tempData,
          id: finalId,
          status: "active",
          isActive: true,
          isPaid: true,
          paymentIntentId: paymentIntent.id,
          activatedAt: new Date().toISOString(),
          content: aiContent,
          // Remove temp-specific fields
          sessionToken: null,
          expiresAt: null,
        })

        // Delete temp trainer
        await tempDoc.ref.delete()

        console.log("Trainer activated successfully:", finalId)
      } catch (error) {
        console.error("Error activating trainer:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
}

async function generateTrainerContent(trainerData: any) {
  const { name, fullName, specialization, experience, location, bio } = trainerData

  return {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialization} • ${experience} • ${location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${fullName || name}`,
      content:
        bio ||
        `Professional ${specialization.toLowerCase()} with ${experience} of experience helping clients achieve their fitness goals in ${location}.`,
      image: "/placeholder.svg?height=400&width=400",
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "€80/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for motivation and community support.",
        price: "€25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with personalized workout plans and nutrition guidance.",
        price: "€150/month",
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
      phone: trainerData.phone || "+43 123 456 789",
      location: location,
    },
  }
}
