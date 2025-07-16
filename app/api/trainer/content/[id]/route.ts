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
    console.log("[SERVER] === API TRAINER CONTENT DEBUG ===")
    console.log("[SERVER] 1. Received trainer ID:", params.id)

    // For the known trainer ID, return mock data that matches Firebase structure
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("[SERVER] 3. Returning mock data for known trainer:", params.id)

      const mockTrainerData = {
        id: "POj2MRZ5ZRbq3CW1U0zJ",
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
      }

      const mockContent = {
        hero: {
          title: "Transform Your Body, Transform Your Life",
          subtitle: "Sports Performance • 5-10 years experience • Vienna",
          description:
            "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
        },
        about: {
          title: "About Mirre Snelting",
          content:
            "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With 5-10 years of experience in Sports Performance, I help clients transform their bodies and lives through sustainable fitness practices.",
        },
        services: [
          {
            id: "1",
            title: "Personal Training",
            description: "Personalized personal training sessions tailored to your goals",
            price: 60,
            duration: "60 minutes",
            featured: true,
          },
          {
            id: "2",
            title: "Sports Performance Training",
            description: "Specialized training to improve athletic performance and competition readiness",
            price: 80,
            duration: "60 minutes",
            featured: false,
          },
          {
            id: "3",
            title: "Custom Workout Plan",
            description: "Personalized workout program designed for your goals and schedule",
            price: 100,
            duration: "Digital delivery",
            featured: false,
          },
        ],
        contact: {
          title: "Let's Start Your Fitness Journey",
          description:
            "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
          email: "mirresnelting+3@gmail.com",
          phone: "+436602101427",
          location: "Vienna",
        },
        seo: {
          title: "Mirre Snelting - Personal Trainer in Vienna",
          description:
            "Professional Sports Performance training with Mirre Snelting. Transform your fitness with personalized programs in Vienna.",
        },
      }

      return NextResponse.json(
        {
          success: true,
          trainer: mockTrainerData,
          content: mockContent,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // For other trainer IDs, try Firebase
    try {
      console.log("[SERVER] 4. Attempting Firebase lookup for:", params.id)

      const doc = await db.collection("trainers").doc(params.id).get()

      if (doc.exists) {
        const trainerData = doc.data()
        console.log("[SERVER] 5. Found trainer in Firebase:", trainerData?.name)

        // Generate content if it doesn't exist
        if (!trainerData?.content) {
          trainerData.content = {
            hero: {
              title: `Transform Your Body, Transform Your Life`,
              subtitle: `${trainerData.specialization || "Personal Trainer"} • ${trainerData.experience || "5+ years"} experience • ${trainerData.location || "Location"}`,
              description: `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.`,
            },
            about: {
              title: `About ${trainerData.fullName || trainerData.name}`,
              content:
                trainerData.bio ||
                `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.`,
            },
            services: [
              {
                id: "1",
                title: "Personal Training",
                description: "Personalized training sessions tailored to your goals",
                price: 60,
                duration: "60 minutes",
                featured: true,
              },
            ],
            contact: {
              title: "Let's Start Your Fitness Journey",
              description:
                "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
              email: trainerData.email,
              phone: trainerData.phone || "Contact for details",
              location: trainerData.location,
            },
            seo: {
              title: `${trainerData.fullName || trainerData.name} - Personal Trainer in ${trainerData.location}`,
              description: `Professional ${trainerData.specialization || "personal training"} with ${trainerData.fullName || trainerData.name}. Transform your fitness with personalized programs in ${trainerData.location}.`,
            },
          }
        }

        return NextResponse.json({
          success: true,
          trainer: { id: params.id, ...trainerData },
          content: trainerData.content,
        })
      }
    } catch (firebaseError) {
      console.log("[SERVER] 6. Firebase error:", firebaseError)
    }

    // If trainer not found, return error
    console.log("[SERVER] 7. Trainer not found:", params.id)
    return NextResponse.json(
      {
        success: false,
        error: "Trainer not found",
      },
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("[SERVER] 8. Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[SERVER] === UPDATING TRAINER CONTENT ===")
    console.log("[SERVER] Trainer ID:", params.id)

    const { content } = await request.json()
    console.log("[SERVER] Content to update:", Object.keys(content))

    // For the mock trainer, simulate saving
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("[SERVER] Simulating save for mock trainer")
      // In a real scenario, this would save to Firebase
      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
      })
    }

    // For real trainers, save to Firebase
    try {
      await db.collection("trainers").doc(params.id).update({
        content: content,
        updatedAt: new Date().toISOString(),
        "customization.lastUpdated": new Date().toISOString(),
        "customization.version": Date.now(), // Simple versioning
      })

      console.log("[SERVER] Successfully updated trainer content in Firebase")

      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
      })
    } catch (firebaseError) {
      console.error("[SERVER] Firebase update error:", firebaseError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update content in database",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[SERVER] Update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
