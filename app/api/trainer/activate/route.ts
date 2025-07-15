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
  try {
    const { tempId, paymentIntentId } = await request.json()

    console.log("Trainer activation request started:", { tempId, paymentIntentId })

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get temp trainer data
    const tempTrainerRef = db.collection("trainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    if (!tempTrainerDoc.exists) {
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
      paymentIntentId: paymentIntentId,
      activatedAt: new Date().toISOString(),
      content: generatedContent,
    }

    // Create new active trainer document
    const activeTrainerRef = db.collection("trainers").doc()
    await activeTrainerRef.set(finalTrainerData)

    console.log("Trainer activated successfully:", activeTrainerRef.id)

    // Delete temp trainer
    await tempTrainerRef.delete()

    return NextResponse.json({
      success: true,
      finalId: activeTrainerRef.id,
      message: "Trainer activated successfully",
    })
  } catch (error: any) {
    console.error("Trainer activation error:", error)
    return NextResponse.json({ error: error.message || "Activation failed" }, { status: 500 })
  }
}
