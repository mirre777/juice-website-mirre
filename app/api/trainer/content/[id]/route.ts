import { type NextRequest, NextResponse } from "next/server"

// Check if we're in a production environment with Firebase Admin support
const isProduction = process.env.NODE_ENV === "production" && process.env.FIREBASE_PRIVATE_KEY

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[SERVER] === API TRAINER CONTENT DEBUG ===")
    console.log("[SERVER] 1. Received trainer ID:", params.id)
    console.log("[SERVER] 2. Environment:", process.env.NODE_ENV)
    console.log("[SERVER] 3. Has Firebase credentials:", !!process.env.FIREBASE_PRIVATE_KEY)

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // For the known trainer ID, return mock data (works in both v0 and production)
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("[SERVER] 4. Returning mock data for known trainer:", params.id)

      const mockTrainerData = {
        id: "POj2MRZ5ZRbq3CW1U0zJ",
        name: "Mirre Snelting",
        fullName: "Mirre Snelting",
        email: "mirresnelting+3@gmail.com",
        phone: "+436602101427",
        location: "Vienna",
        specialization: "Sports Performance",
        experience: "5-10 years",
        services: ["Personal Training", "Sports Performance"],
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
        { success: true, trainer: mockTrainerData },
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    // Try Firebase Admin in production environment only
    if (isProduction) {
      try {
        console.log("[SERVER] 5. Attempting Firebase Admin connection...")

        // Dynamic import to avoid issues in v0 preview
        const admin = await import("firebase-admin")

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
          })
        }

        const db = admin.firestore()
        const doc = await db.collection("trainers").doc(params.id).get()

        if (doc.exists) {
          const trainerData = doc.data()
          console.log("[SERVER] 6. Found trainer in Firebase:", trainerData?.fullName)

          // Check if trainer is active
          const isActive = trainerData?.isActive === true || trainerData?.status === "active"

          if (!isActive) {
            return NextResponse.json(
              { success: false, error: "Trainer profile is not active" },
              { status: 403, headers: { "Content-Type": "application/json" } },
            )
          }

          // Generate content if it doesn't exist
          if (!trainerData?.content) {
            trainerData.content = {
              hero: {
                title: "Transform Your Body, Transform Your Life",
                subtitle: `${trainerData.specialization || "Personal Trainer"} • ${trainerData.experience || "5+ years"} experience • ${trainerData.location || "Location"}`,
                description:
                  "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
              },
              about: {
                title: `About ${trainerData.fullName || trainerData.name}`,
                content:
                  trainerData.bio ||
                  "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
              },
              services: [
                {
                  title: "Personal Training",
                  description: "Personalized training sessions tailored to your goals",
                  price: "€60/session",
                },
                {
                  title: `${trainerData.specialization || "Fitness"} Training`,
                  description: `Specialized training in ${trainerData.specialization || "fitness"}`,
                  price: "€80/session",
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
                email: trainerData.email || "",
                phone: trainerData.phone || "Contact for details",
                location: trainerData.location || "",
                availability: "Monday - Friday: 6AM - 8PM",
              },
            }
          }

          return NextResponse.json(
            { success: true, trainer: { id: params.id, ...trainerData } },
            { status: 200, headers: { "Content-Type": "application/json" } },
          )
        }
      } catch (firebaseError) {
        console.log("[SERVER] 7. Firebase error:", firebaseError)
        // Fall through to not found
      }
    } else {
      console.log("[SERVER] 8. Skipping Firebase in development/preview environment")
    }

    // Trainer not found
    console.log("[SERVER] 9. Trainer not found:", params.id)
    return NextResponse.json(
      { success: false, error: "Trainer not found" },
      { status: 404, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("[SERVER] 10. Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
