import { type NextRequest, NextResponse } from "next/server"

// Server-side Firebase Admin SDK import
async function getFirebaseAdmin() {
  const admin = await import("firebase-admin")

  if (!admin.apps.length) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })

      console.log("[SERVER] Firebase Admin initialized successfully")
    } catch (error) {
      console.error("[SERVER] Firebase Admin initialization failed:", error)
      throw error
    }
  }

  return admin
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id

    console.log("[SERVER] === TRAINER CONTENT API DEBUG ===")
    console.log("[SERVER] 1. Fetching trainer ID:", trainerId)
    console.log("[SERVER] 2. Request URL:", request.url)

    if (!trainerId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    try {
      // Initialize Firebase Admin
      const admin = await getFirebaseAdmin()
      const db = admin.firestore()

      console.log("[SERVER] 3. Querying Firestore for trainer:", trainerId)

      // Fetch trainer document
      const trainerDoc = await db.collection("trainers").doc(trainerId).get()

      if (!trainerDoc.exists) {
        console.log("[SERVER] 4. Trainer document not found in Firestore")
        return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
      }

      const trainerData = trainerDoc.data()
      console.log("[SERVER] 5. Found trainer data:", {
        id: trainerId,
        name: trainerData?.fullName || trainerData?.name,
        status: trainerData?.status,
        isActive: trainerData?.isActive,
        hasContent: !!trainerData?.content,
      })

      // Check if trainer is active
      if (trainerData?.status !== "active" && !trainerData?.isActive) {
        console.log("[SERVER] 6. Trainer is not active")
        return NextResponse.json({ success: false, error: "Trainer profile not active" }, { status: 403 })
      }

      // Generate content if it doesn't exist
      let content = trainerData?.content
      if (!content) {
        console.log("[SERVER] 7. Generating default content for trainer")
        content = generateDefaultContent(trainerData)
      }

      // Prepare trainer response
      const trainerResponse = {
        id: trainerId,
        name: trainerData?.fullName || trainerData?.name || "Trainer",
        fullName: trainerData?.fullName,
        email: trainerData?.email,
        phone: trainerData?.phone,
        location: trainerData?.location,
        specialization: trainerData?.specialty || trainerData?.specialization,
        experience: trainerData?.experience,
        bio: trainerData?.bio,
        certifications: trainerData?.certifications,
        services: trainerData?.services,
        isActive: trainerData?.isActive || trainerData?.status === "active",
        status: trainerData?.status,
        activatedAt: trainerData?.activatedAt,
        content: content,
      }

      console.log("[SERVER] 8. Returning trainer data successfully")

      return NextResponse.json({
        success: true,
        trainer: trainerResponse,
      })
    } catch (firebaseError) {
      console.error("[SERVER] 9. Firebase error:", firebaseError)

      // Fallback to mock data for development
      console.log("[SERVER] 10. Falling back to mock data")

      const mockTrainerData = {
        id: trainerId,
        name: "Mirre Snelting",
        fullName: "Mirre Snelting",
        email: "mirresnelting@gmail.com",
        phone: "+436602101427",
        location: "Vienna",
        specialization: "CrossFit Coach",
        experience: "1-2 years",
        services: ["Group Fitness"],
        isActive: true,
        status: "active",
        content: {
          hero: {
            title: "Transform Your Body, Transform Your Life",
            subtitle: "CrossFit Coach • 1-2 years experience • Vienna",
            description:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
          },
          about: {
            title: "About Mirre Snelting",
            content:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With 1-2 years of experience in CrossFit coaching, I help clients transform their bodies and lives through sustainable fitness practices.",
          },
          services: [
            {
              title: "Group Fitness",
              description: "High-energy group fitness sessions designed to motivate and challenge",
              price: "€45",
            },
            {
              title: "CrossFit Training",
              description: "Functional fitness training focusing on strength, conditioning, and mobility",
              price: "€60",
            },
            {
              title: "Personal Training",
              description: "One-on-one personalized training sessions tailored to your goals",
              price: "€70",
            },
          ],
          testimonials: [
            {
              name: "Anna K.",
              text: "Working with Mirre has been incredible. Their CrossFit expertise helped me achieve results I never thought possible.",
              rating: 5,
            },
            {
              name: "Tom R.",
              text: "Professional, motivating, and knowledgeable. The group fitness sessions are amazing!",
              rating: 5,
            },
            {
              name: "Sarah M.",
              text: "Excellent CrossFit coaching. Achieved my fitness goals with Mirre's guidance!",
              rating: 5,
            },
          ],
          contact: {
            email: "mirresnelting@gmail.com",
            phone: "+436602101427",
            location: "Vienna",
            availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
          },
        },
      }

      return NextResponse.json({
        success: true,
        trainer: mockTrainerData,
      })
    }
  } catch (error) {
    console.error("[SERVER] 11. Unexpected error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateDefaultContent(trainerData: any) {
  const name = trainerData?.fullName || trainerData?.name || "Trainer"
  const specialty = trainerData?.specialty || trainerData?.specialization || "Personal Training"
  const experience = trainerData?.experience || "5+ years"
  const location = trainerData?.location || "Location"

  return {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialty} • ${experience} experience • ${location}`,
      description: `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.`,
    },
    about: {
      title: `About ${name}`,
      content:
        trainerData?.bio ||
        `Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With ${experience} of experience in ${specialty}, I help clients transform their bodies and lives through sustainable fitness practices.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one personalized training sessions tailored to your goals",
        price: "€60",
      },
      {
        title: "Group Classes",
        description: "Small group fitness classes for motivation and community",
        price: "€30",
      },
      {
        title: "Nutrition Coaching",
        description: "Personalized nutrition plans and ongoing support",
        price: "€100",
      },
    ],
    testimonials: [
      {
        name: "Client A.",
        text: `Working with ${name} has been amazing! Their ${specialty} expertise is outstanding.`,
        rating: 5,
      },
      {
        name: "Client B.",
        text: "Professional, motivating, and knowledgeable trainer. Highly recommend!",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData?.email || "contact@trainer.com",
      phone: trainerData?.phone || "Contact for details",
      location: trainerData?.location || "Location",
      availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
    },
  }
}
