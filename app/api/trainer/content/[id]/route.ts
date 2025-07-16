import { type NextRequest, NextResponse } from "next/server"
import { getTrainerById } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id

    console.log("[SERVER] === TRAINER CONTENT API DEBUG ===")
    console.log("[SERVER] 1. Fetching trainer ID:", trainerId)

    if (!trainerId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    try {
      console.log("[SERVER] 2. Querying Firestore for trainer:", trainerId)

      // Fetch trainer document using Firebase Admin
      const trainerData = await getTrainerById(trainerId)

      if (!trainerData) {
        console.log("[SERVER] 3. Trainer document not found in Firestore")
        return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
      }

      console.log("[SERVER] 4. Found trainer data:", {
        id: trainerId,
        name: trainerData?.fullName || trainerData?.name,
        status: trainerData?.status,
        isActive: trainerData?.isActive,
        hasContent: !!trainerData?.content,
      })

      // Check if trainer is active
      if (trainerData?.status !== "active" && !trainerData?.isActive) {
        console.log("[SERVER] 5. Trainer is not active")
        return NextResponse.json({ success: false, error: "Trainer profile not active" }, { status: 403 })
      }

      // Use existing content or generate default
      let content = trainerData?.content
      if (!content) {
        console.log("[SERVER] 6. No content found, generating default")
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

      console.log("[SERVER] 7. Returning trainer data successfully")

      return NextResponse.json({
        success: true,
        trainer: trainerResponse,
      })
    } catch (firebaseError) {
      console.error("[SERVER] 8. Firebase error:", firebaseError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection error",
          details: firebaseError instanceof Error ? firebaseError.message : "Unknown Firebase error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[SERVER] 9. Unexpected error:", error)
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
