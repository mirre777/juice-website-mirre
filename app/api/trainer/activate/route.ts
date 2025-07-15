import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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
  try {
    const { tempId, paymentIntentId } = await request.json()

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log("Activating trainer:", { tempId, paymentIntentId })

    // Get temp trainer data
    const tempDoc = await db.collection("trainers").doc(tempId).get()
    if (!tempDoc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
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

    // Generate AI content
    const aiContent = await generateTrainerContent(tempData)

    // Create final trainer document
    const finalId = `trainer_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    await db
      .collection("trainers")
      .doc(finalId)
      .set({
        ...tempData,
        id: finalId,
        status: "active",
        isActive: true,
        isPaid: true,
        paymentIntentId: paymentIntentId,
        content: aiContent,
        activatedAt: new Date().toISOString(),
      })

    // Update temp trainer
    await db.collection("trainers").doc(tempId).update({
      status: "activated",
      finalId: finalId,
      activatedAt: new Date().toISOString(),
    })

    console.log("Trainer activated successfully:", finalId)

    return NextResponse.json({
      success: true,
      finalId: finalId,
      message: "Trainer activated successfully",
    })
  } catch (error: any) {
    console.error("Error activating trainer:", error)
    return NextResponse.json({ error: error.message || "Activation failed" }, { status: 500 })
  }
}

async function generateTrainerContent(trainerData: any) {
  return {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${trainerData.specialization} • ${trainerData.experience} • ${trainerData.location}`,
      description: `Professional fitness coaching tailored to your goals. Get the results you've been looking for with personalized training programs.`,
    },
    about: {
      title: `About ${trainerData.fullName || trainerData.name}`,
      content: `With ${trainerData.experience} of experience in ${trainerData.specialization}, I'm dedicated to helping you achieve your fitness goals. My approach combines proven training methods with personalized attention to ensure you get the results you want.`,
      certifications: trainerData.certifications || ["Certified Personal Trainer", "Nutrition Specialist"],
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "€80/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for a more social and cost-effective approach.",
        price: "€25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with custom workout plans and nutrition guidance.",
        price: "€150/month",
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
      phone: trainerData.phone || "+43 123 456 789",
      location: trainerData.location,
    },
  }
}
