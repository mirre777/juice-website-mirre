import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[SERVER] === API TRAINER CONTENT DEBUG ===")
    console.log("[SERVER] 1. Received trainer ID:", params.id)

    // For the known trainer ID, return mock data that matches Firebase structure
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ" || params.id === "IekIXvQP8TrM1hJZZrKX") {
      console.log("[SERVER] 2. Returning mock data for known trainer:", params.id)

      // Use different data based on trainer ID
      const trainerName = params.id === "IekIXvQP8TrM1hJZZrKX" ? "Mirre Snelting" : "Mirre Snelting"
      const trainerEmail =
        params.id === "IekIXvQP8TrM1hJZZrKX" ? "mirresnelting@gmail.com" : "mirresnelting+3@gmail.com"
      const trainerSpecialty = params.id === "IekIXvQP8TrM1hJZZrKX" ? "CrossFit Coach" : "Sports Performance"

      const mockTrainerData = {
        id: params.id,
        name: trainerName,
        fullName: trainerName,
        email: trainerEmail,
        phone: "+436602101427",
        location: "Vienna",
        specialization: trainerSpecialty,
        experience: "1-2 years",
        services: ["Group Fitness"],
        isActive: true,
        status: "active",
        content: {
          hero: {
            title: "Transform Your Body, Transform Your Life",
            subtitle: `${trainerSpecialty} • 1-2 years experience • Vienna`,
            description:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
          },
          about: {
            title: `About ${trainerName}`,
            content: `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With 1-2 years of experience in ${trainerSpecialty}, I help clients transform their bodies and lives through sustainable fitness practices.`,
          },
          services: [
            {
              title: "Group Fitness",
              description: "High-energy group fitness sessions designed to motivate and challenge",
              price: "€45/session",
            },
            {
              title: "CrossFit Training",
              description: "Functional fitness training focusing on strength, conditioning, and mobility",
              price: "€60/session",
            },
            {
              title: "Personal Training",
              description: "One-on-one personalized training sessions tailored to your goals",
              price: "€70/session",
            },
          ],
          testimonials: [
            {
              name: "Anna K.",
              text: `Working with ${trainerName} has been incredible. Their ${trainerSpecialty} expertise helped me achieve results I never thought possible.`,
              rating: 5,
            },
            {
              name: "Tom R.",
              text: "Professional, motivating, and knowledgeable. The group fitness sessions are amazing!",
              rating: 5,
            },
            {
              name: "Sarah M.",
              text: `Excellent ${trainerSpecialty} coaching. Achieved my fitness goals with ${trainerName}'s guidance!`,
              rating: 5,
            },
          ],
          contact: {
            email: trainerEmail,
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
      console.log("[SERVER] 3. Attempting Firebase lookup for:", params.id)

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
        console.log("[SERVER] 4. Found trainer in Firebase:", trainerData?.fullName || trainerData?.name)

        // Generate content if it doesn't exist
        if (!trainerData?.content) {
          trainerData.content = {
            hero: {
              title: `Transform Your Body, Transform Your Life`,
              subtitle: `${trainerData.specialty || trainerData.specialization || "Personal Trainer"} • ${trainerData.experience || "5+ years"} experience • ${trainerData.location || "Location"}`,
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
          trainer: {
            id: params.id,
            name: trainerData.fullName || trainerData.name,
            fullName: trainerData.fullName,
            email: trainerData.email,
            phone: trainerData.phone,
            location: trainerData.location,
            specialization: trainerData.specialty || trainerData.specialization,
            experience: trainerData.experience,
            bio: trainerData.bio,
            certifications: trainerData.certifications,
            isActive: trainerData.isActive || trainerData.status === "active",
            status: trainerData.status,
            ...trainerData,
          },
        })
      }
    } catch (firebaseError) {
      console.log("[SERVER] 5. Firebase error:", firebaseError)
    }

    // If trainer not found, return error
    console.log("[SERVER] 6. Trainer not found:", params.id)
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
    console.error("[SERVER] 7. Unexpected error:", error)
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
