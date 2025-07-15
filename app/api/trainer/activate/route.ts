import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import Stripe from "stripe"

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
        `I'm ${fullName || name}, a certified ${specialization} based in ${location}. With ${experience} in the fitness industry, I specialize in creating customized workout plans that deliver real results.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one sessions tailored to your specific goals",
        price: "€80/session",
      },
      {
        title: "Group Training",
        description: "Small group sessions for motivation",
        price: "€35/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with custom plans",
        price: "€150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Working with this trainer has completely transformed my approach to fitness!",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating. Incredible results!",
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
  try {
    const { tempId, paymentIntentId } = await request.json()

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log("Activating trainer:", { tempId, paymentIntentId })

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get temp trainer data
    const tempDoc = await db.collection("trainers").doc(tempId).get()
    if (!tempDoc.exists) {
      return NextResponse.json({ error: "Temp trainer not found" }, { status: 404 })
    }

    const tempData = tempDoc.data()!

    // Check if already activated
    if (tempData.status === "activated" && tempData.finalId) {
      return NextResponse.json({
        success: true,
        finalId: tempData.finalId,
        message: "Trainer already activated",
      })
    }

    // Generate final trainer ID
    const finalId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Generate AI content
    const aiContent = await generateTrainerContent(tempData)

    // Create final trainer document
    const finalTrainerData = {
      ...tempData,
      id: finalId,
      content: aiContent,
      isActive: true,
      activatedAt: new Date().toISOString(),
      paymentIntentId,
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
    console.error("Activation error:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
