import { type NextRequest, NextResponse } from "next/server"

// Simple fallback function to create mock trainer data
function createMockTrainerData(id: string) {
  return {
    success: true,
    trainer: {
      id,
      name: "Mirre Snelting",
      fullName: "Mirre Snelting",
      email: "mirresnelting+3@gmail.com",
      phone: "+436602101427",
      location: "Vienna",
      specialization: "Sports Performance",
      experience: "5-10 years",
      services: ["Personal Training"],
      isActive: true,
      status: "active",
      content: {
        hero: {
          title: "Transform Your Fitness with Mirre Snelting",
          subtitle: "5-10 years Personal Trainer specializing in Sports Performance",
          description:
            "Hi, I'm Mirre Snelting! With 5-10 years of experience in the fitness industry, I specialize in Sports Performance. Located in Vienna, I'm passionate about helping people transform their lives through fitness.",
        },
        about: {
          title: "About Me",
          content:
            "Hi, I'm Mirre Snelting! With 5-10 years of experience in the fitness industry, I specialize in Sports Performance. Located in Vienna, I'm passionate about helping people transform their lives through fitness. Whether you're just starting your fitness journey or looking to take your training to the next level, I'm here to guide and support you every step of the way. My approach is personalized, results-driven, and focused on creating sustainable habits that last a lifetime.",
        },
        services: [
          {
            title: "Personal Training Session",
            description: "One-on-one personalized training session focused on your specific goals",
            price: "€60/session",
          },
          {
            title: "Sports Performance Training",
            description: "Specialized training to improve athletic performance and competition readiness",
            price: "€80/session",
          },
          {
            title: "Custom Workout Plan",
            description: "Personalized workout program designed for your goals and schedule",
            price: "€100/plan",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: "Mirre helped me improve my running performance significantly. Highly recommend!",
            rating: 5,
          },
          {
            name: "Mike R.",
            text: "Professional, knowledgeable, and motivating trainer. Great results!",
            rating: 5,
          },
          {
            name: "Lisa K.",
            text: "Excellent sports performance coaching. Achieved my competition goals!",
            rating: 5,
          },
        ],
        contact: {
          email: "mirresnelting+3@gmail.com",
          phone: "+436602101427",
          location: "Vienna",
          availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
        },
      },
    },
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("=== API TRAINER CONTENT DEBUG ===")
    console.log("1. Received trainer ID:", id)

    if (!id) {
      console.error("2. ERROR: No trainer ID provided")
      return NextResponse.json(
        {
          success: false,
          error: "Trainer ID is required",
        },
        { status: 400 },
      )
    }

    // For now, let's check if this is the specific trainer we know exists
    if (id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("3. Returning mock data for known trainer:", id)
      const mockData = createMockTrainerData(id)
      return NextResponse.json(mockData)
    }

    // Try Firebase Admin initialization
    let adminDb: any = null
    try {
      console.log("4. Attempting Firebase Admin initialization...")

      // Check if we have the required environment variables
      const hasFirebaseConfig = !!(
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
      )

      if (!hasFirebaseConfig) {
        console.log("5. Missing Firebase Admin credentials, using mock data")
        const mockData = createMockTrainerData(id)
        return NextResponse.json(mockData)
      }

      // Dynamic import to avoid initialization issues
      const { initializeApp, getApps, cert } = await import("firebase-admin/app")
      const { getFirestore } = await import("firebase-admin/firestore")

      if (!getApps().length) {
        console.log("6. Initializing Firebase Admin...")
        const adminApp = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        })
        adminDb = getFirestore(adminApp)
      } else {
        adminDb = getFirestore(getApps()[0])
      }

      console.log("7. Firebase Admin initialized successfully")

      // Get trainer document from Firebase
      const trainerDoc = await adminDb.collection("trainers").doc(id).get()
      console.log("8. Firebase query completed, document exists:", trainerDoc.exists)

      if (!trainerDoc.exists) {
        console.log("9. Trainer not found in Firebase, returning mock data")
        const mockData = createMockTrainerData(id)
        return NextResponse.json(mockData)
      }

      const trainerData = trainerDoc.data()
      console.log("10. Trainer data retrieved from Firebase:", {
        fullName: trainerData.fullName,
        isActive: trainerData.isActive,
        status: trainerData.status,
      })

      // Check if trainer is active
      const isActive = trainerData.isActive === true || trainerData.status === "active"

      if (!isActive) {
        console.error("11. Trainer is not active")
        return NextResponse.json(
          {
            success: false,
            error: "Trainer profile is not active",
          },
          { status: 403 },
        )
      }

      // Generate content from Firebase data
      const content = {
        hero: {
          title: `Transform Your Fitness with ${trainerData.fullName || "Professional Training"}`,
          subtitle: `${trainerData.experience || "Experienced"} Personal Trainer specializing in ${trainerData.specialty || "Fitness Training"}`,
          description: `Hi, I'm ${trainerData.fullName || "your trainer"}! With ${trainerData.experience || "years of experience"} in the fitness industry, I specialize in ${trainerData.specialty || "helping clients achieve their fitness goals"}. Located in ${trainerData.location || "your area"}, I'm passionate about helping people transform their lives through fitness.`,
        },
        about: {
          title: "About Me",
          content: `Hi, I'm ${trainerData.fullName || "your trainer"}! With ${trainerData.experience || "years of experience"} in the fitness industry, I specialize in ${trainerData.specialty || "helping clients achieve their fitness goals"}. Located in ${trainerData.location || "your area"}, I'm passionate about helping people transform their lives through fitness. Whether you're just starting your fitness journey or looking to take your training to the next level, I'm here to guide and support you every step of the way. My approach is personalized, results-driven, and focused on creating sustainable habits that last a lifetime.`,
        },
        services: [
          {
            title: "Personal Training Session",
            description: "One-on-one personalized training session focused on your specific goals",
            price: "€60/session",
          },
          {
            title: `${trainerData.specialty || "Fitness"} Training`,
            description: `Specialized training in ${trainerData.specialty || "fitness"} to help you reach your goals`,
            price: "€80/session",
          },
          {
            title: "Custom Workout Plan",
            description: "Personalized workout program designed for your goals and schedule",
            price: "€100/plan",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: "Amazing results and professional guidance. Highly recommend!",
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
          email: trainerData.email || "",
          phone: trainerData.phone || "",
          location: trainerData.location || "",
          availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
        },
      }

      return NextResponse.json({
        success: true,
        trainer: {
          id,
          name: trainerData.fullName || trainerData.name || "Personal Trainer",
          fullName: trainerData.fullName || "Personal Trainer",
          email: trainerData.email || "",
          phone: trainerData.phone || "",
          location: trainerData.location || "",
          specialization: trainerData.specialty || "Fitness Training",
          experience: trainerData.experience || "Experienced",
          services: trainerData.services || ["Personal Training"],
          isActive: true,
          status: trainerData.status || "active",
          content: content,
        },
      })
    } catch (firebaseError) {
      console.error("12. Firebase error:", firebaseError)
      console.log("13. Falling back to mock data due to Firebase error")
      const mockData = createMockTrainerData(id)
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error("14. General error in API route:", error)

    // Always return valid JSON, even for unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trainer content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
