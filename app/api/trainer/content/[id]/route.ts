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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log("Fetching trainer content for:", id)

    // Get trainer document
    const trainerDoc = await db.collection("trainers").doc(id).get()

    if (!trainerDoc.exists) {
      console.log("Trainer not found:", id)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!
    console.log("Trainer data found:", {
      id: trainerData.id,
      status: trainerData.status,
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
      fullName: trainerData.fullName,
    })

    // Check if trainer is active (either isActive: true OR status: "active")
    const isTrainerActive = trainerData.isActive === true || trainerData.status === "active"

    if (!isTrainerActive) {
      console.log("Trainer profile not active:", { isActive: trainerData.isActive, status: trainerData.status })
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    // Generate default content if none exists
    const content = trainerData.content || generateDefaultContent(trainerData)

    console.log("Trainer content found:", trainerData.fullName || trainerData.name)

    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerData.id || id,
        name: trainerData.name || trainerData.fullName,
        fullName: trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
        specialization: trainerData.specialty || trainerData.specialization,
        experience: trainerData.experience,
        bio: trainerData.bio,
        certifications: trainerData.certifications || [],
        content: content,
        isActive: isTrainerActive,
        activatedAt: trainerData.activatedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

// Generate default content structure
function generateDefaultContent(trainerData: any) {
  const name = trainerData.fullName || trainerData.name || "Personal Trainer"
  const specialization = trainerData.specialty || trainerData.specialization || "Fitness Training"
  const experience = trainerData.experience || "Professional"
  const location = trainerData.location || "Local Area"
  const email = trainerData.email || ""
  const phone = trainerData.phone || ""

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialization} training tailored to your goals`,
      description: `Welcome! I'm ${name}, a certified personal trainer specializing in ${specialization}. With ${experience} of experience, I'm here to help you achieve your fitness goals through personalized training programs.`,
    },
    about: {
      title: "About Me",
      content: `I'm ${name}, a passionate fitness professional with ${experience} of experience in ${specialization}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.\n\nMy approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.\n\nI'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`,
    },
    services: [
      {
        title: "Personal Training Session",
        description: "One-on-one personalized training session focused on your specific goals",
        price: "€60/session",
      },
      {
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation and goal-setting session",
        price: "€40/session",
      },
      {
        title: "Custom Workout Plan",
        description: "Personalized workout program designed for your goals and schedule",
        price: "€80/plan",
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
        text: "Helped me achieve my fitness goals beyond expectations.",
        rating: 5,
      },
    ],
    contact: {
      email: email,
      phone: phone,
      location: location,
      availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
    },
  }
}
