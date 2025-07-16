import { type NextRequest, NextResponse } from "next/server"
import { getTrainerById } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    console.log("[TRAINER CONTENT] Fetching content for trainer:", trainerId)

    if (!trainerId) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    try {
      // Try to get trainer from Firebase
      const trainer = await getTrainerById(trainerId)

      if (trainer && trainer.isActive) {
        console.log("[TRAINER CONTENT] Active trainer found:", trainer.fullName || trainer.name)

        // Return trainer data with content
        return NextResponse.json({
          success: true,
          trainer: {
            id: trainer.id,
            name: trainer.fullName || trainer.name,
            email: trainer.email,
            phone: trainer.phone,
            location: trainer.location,
            specialty: trainer.specialty || trainer.specialization,
            experience: trainer.experience,
            bio: trainer.bio,
            services: trainer.services,
            isActive: trainer.isActive,
            status: trainer.status,
            content: trainer.content || generateDefaultContent(trainer),
          },
        })
      }

      // If not found in Firebase, check if it's a known test trainer
      const mockTrainer = getMockTrainerData(trainerId)
      if (mockTrainer) {
        console.log("[TRAINER CONTENT] Using mock data for:", trainerId)
        return NextResponse.json({
          success: true,
          trainer: mockTrainer,
        })
      }

      console.log("[TRAINER CONTENT] Trainer not found or not active:", trainerId)
      return NextResponse.json({ error: "Trainer not found or not active" }, { status: 404 })
    } catch (firebaseError) {
      console.error("[TRAINER CONTENT] Firebase error:", firebaseError)

      // Fallback to mock data for development
      const mockTrainer = getMockTrainerData(trainerId)
      if (mockTrainer) {
        console.log("[TRAINER CONTENT] Using mock data fallback for:", trainerId)
        return NextResponse.json({
          success: true,
          trainer: mockTrainer,
        })
      }

      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }
  } catch (error) {
    console.error("[TRAINER CONTENT] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateDefaultContent(trainer: any) {
  const name = trainer.fullName || trainer.name || "Trainer"
  const specialty = trainer.specialty || trainer.specialization || "Personal Training"
  const experience = trainer.experience || "5+ years"
  const location = trainer.location || "Location"

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialty} in ${location}`,
      description: `With ${experience} of experience, I help clients achieve their fitness goals through personalized training programs and expert guidance.`,
    },
    about: {
      title: "About Me",
      content: `I'm ${name}, a certified ${specialty} based in ${location}. With ${experience} in the fitness industry, I specialize in creating customized workout plans that deliver real results.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one sessions tailored to your specific goals",
        price: "€80",
      },
      {
        title: "Group Training",
        description: "Small group sessions for motivation and cost-effective training",
        price: "€35",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Working with this trainer has completely transformed my approach to fitness!",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating. Highly recommend!",
        rating: 5,
      },
    ],
    contact: {
      email: trainer.email,
      phone: trainer.phone || "+31 6 1234 5678",
      location: trainer.location,
    },
  }
}

function getMockTrainerData(trainerId: string) {
  // Mock data for specific trainer IDs for development
  const mockTrainers: { [key: string]: any } = {
    IekIXvQP8TrM1hJZZrKX: {
      id: "IekIXvQP8TrM1hJZZrKX",
      name: "Mirre Snelting",
      email: "mirresnelting@gmail.com",
      phone: "+436602101427",
      location: "Vienna",
      specialty: "CrossFit Coach",
      experience: "1-2 years",
      bio: "Passionate CrossFit coach helping clients achieve their fitness goals",
      isActive: true,
      status: "active",
      content: {
        hero: {
          title: "Transform Your Fitness with Mirre Snelting",
          subtitle: "Professional CrossFit Coach in Vienna",
          description:
            "With 1-2 years of experience, I help clients achieve their fitness goals through personalized CrossFit training programs.",
        },
        about: {
          title: "About Me",
          content:
            "I'm Mirre Snelting, a certified CrossFit Coach based in Vienna. I specialize in creating customized workout plans that deliver real results through functional fitness movements.",
        },
        services: [
          {
            title: "CrossFit Training",
            description: "High-intensity functional fitness workouts",
            price: "€75",
          },
          {
            title: "Group Fitness",
            description: "Small group CrossFit sessions",
            price: "€40",
          },
        ],
        testimonials: [
          {
            name: "Anna K.",
            text: "Mirre's CrossFit coaching has transformed my strength and endurance!",
            rating: 5,
          },
          {
            name: "Tom H.",
            text: "Professional and motivating coach. Highly recommend!",
            rating: 5,
          },
        ],
        contact: {
          email: "mirresnelting@gmail.com",
          phone: "+436602101427",
          location: "Vienna",
        },
      },
    },
  }

  return mockTrainers[trainerId] || null
}
