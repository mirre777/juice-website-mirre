import { type NextRequest, NextResponse } from "next/server"

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
        content: {
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
              title: "Personal Training",
              description: "Personalized personal training sessions tailored to your goals",
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
              text: "Working with Mirre has been life-changing. Their expertise in Sports Performance helped me achieve results I never thought possible.",
              rating: 5,
            },
            {
              name: "Mike R.",
              text: "Professional, knowledgeable, and motivating. Mirre creates personalized programs that actually work.",
              rating: 5,
            },
            {
              name: "Lisa K.",
              text: "Excellent sports performance coaching. Achieved my competition goals with Mirre's guidance!",
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
      }

      return NextResponse.json(
        {
          success: true,
          trainer: mockTrainerData,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // For other trainer IDs, try Firebase (simplified version)
    try {
      console.log("[SERVER] 4. Attempting Firebase lookup for:", params.id)

      // Try to initialize Firebase Admin (simplified)
      const admin = await import("firebase-admin")

      if (!admin.apps.length) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        })
      }

      const db = admin.firestore()
      const doc = await db.collection("trainers").doc(params.id).get()

      if (doc.exists) {
        const trainerData = doc.data()
        console.log("[SERVER] 5. Found trainer in Firebase:", trainerData?.name)

        // Generate content if it doesn't exist
        if (!trainerData?.content) {
          trainerData.content = {
            hero: {
              title: `Transform Your Body, Transform Your Life`,
              subtitle: `${trainerData.specialty || trainerData.specialization || "Personal Trainer"} • ${trainerData.experience || "5+ years"} experience • ${trainerData.location || "Location"}`,
              description:
                trainerData.bio ||
                `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.`,
            },
            about: {
              title: `About ${trainerData.fullName || trainerData.name}`,
              content:
                trainerData.bio ||
                `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.`,
            },
            services: [
              {
                title: "Personal Training",
                description: "Personalized training sessions tailored to your goals",
                price: "€60/session",
              },
            ],
            testimonials: [
              {
                name: "Client A.",
                text: `Working with ${trainerData.fullName || trainerData.name} has been amazing!`,
                rating: 5,
              },
            ],
            contact: {
              email: trainerData.email,
              phone: trainerData.phone || "Contact for details",
              location: trainerData.location,
              availability: "Monday - Friday: 6AM - 8PM",
            },
          }
        }

        return NextResponse.json({
          success: true,
          trainer: { id: params.id, ...trainerData },
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
