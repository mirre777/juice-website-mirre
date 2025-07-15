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
  const { name, fullName, specialization, location, experience, bio } = trainerData

  return {
    hero: {
      title: `Transform Your Fitness with ${fullName || name}`,
      subtitle: `Professional ${specialization} in ${location}`,
      description: `With ${experience} of experience, I help clients achieve their fitness goals through personalized training programs and expert guidance.`,
    },
    about: {
      title: "About Me",
      content:
        bio ||
        `I'm ${fullName || name}, a certified ${specialization} based in ${location}. With ${experience} in the fitness industry, I specialize in creating customized workout plans that deliver real results. My approach combines proven training methods with personalized attention to help you reach your fitness goals safely and effectively.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one sessions tailored to your specific goals and fitness level",
        price: "€80/session",
      },
      {
        title: "Group Training",
        description: "Small group sessions for motivation and cost-effective training",
        price: "€35/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with custom workout plans and nutrition guidance",
        price: "€150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Working with this trainer has completely transformed my approach to fitness. The personalized programs really work!",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating. I've seen incredible results in just 3 months.",
        rating: 5,
      },
      {
        name: "Emma L.",
        text: "The best investment I've made in my health. Highly recommend to anyone serious about fitness.",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "+31 6 1234 5678",
      location: trainerData.location,
      availability: "Monday - Saturday, 6:00 AM - 8:00 PM",
    },
  }
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
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log("Payment succeeded:", paymentIntent.id)

    try {
      const tempId = paymentIntent.metadata.tempId
      if (!tempId) {
        console.error("No tempId in payment metadata")
        return NextResponse.json({ error: "Missing tempId" }, { status: 400 })
      }

      // Get temp trainer data
      const tempDoc = await db.collection("trainers").doc(tempId).get()
      if (!tempDoc.exists) {
        console.error("Temp trainer not found:", tempId)
        return NextResponse.json({ error: "Temp trainer not found" }, { status: 404 })
      }

      const tempData = tempDoc.data()!
      console.log("Activating trainer:", tempData.name)

      // Generate final trainer ID
      const finalId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Generate AI content for the trainer
      const aiContent = await generateTrainerContent(tempData)

      // Create final trainer document
      const finalTrainerData = {
        ...tempData,
        id: finalId,
        content: aiContent,
        isActive: true,
        activatedAt: new Date().toISOString(),
        paymentIntentId: paymentIntent.id,
        status: "active",
      }

      await db.collection("trainers").doc(finalId).set(finalTrainerData)
      console.log("Trainer activated successfully:", finalId)

      // Update temp trainer with final ID
      await db.collection("trainers").doc(tempId).update({
        status: "activated",
        finalId: finalId,
        activatedAt: new Date().toISOString(),
      })

      return NextResponse.json({ success: true, finalId })
    } catch (error) {
      console.error("Error activating trainer:", error)
      return NextResponse.json({ error: "Activation failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
