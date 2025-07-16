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

      if (trainer && trainer.content) {
        console.log("[TRAINER CONTENT] Found trainer with content in Firebase")
        return NextResponse.json({
          success: true,
          trainer: trainer,
          content: trainer.content,
        })
      }

      if (trainer) {
        console.log("[TRAINER CONTENT] Found trainer but no content, generating default")
        // Generate default content if trainer exists but has no content
        const defaultContent = generateDefaultContent(trainer)
        return NextResponse.json({
          success: true,
          trainer: trainer,
          content: defaultContent,
        })
      }
    } catch (firebaseError) {
      console.error("[TRAINER CONTENT] Firebase error:", firebaseError)
    }

    // Fallback to mock data for development
    console.log("[TRAINER CONTENT] Using mock data for trainer:", trainerId)
    const mockContent = getMockTrainerContent(trainerId)

    return NextResponse.json({
      success: true,
      trainer: mockContent.trainer,
      content: mockContent.content,
    })
  } catch (error) {
    console.error("[TRAINER CONTENT] Error:", error)
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
    ],
    contact: {
      email: trainer.email,
      phone: trainer.phone || "+31 6 1234 5678",
      location: trainer.location,
    },
  }
}

function getMockTrainerContent(trainerId: string) {
  // Mock data for specific trainer IDs
  const mockTrainers: { [key: string]: any } = {
    IekIXvQP8TrM1hJZZrKX: {
      trainer: {
        id: "IekIXvQP8TrM1hJZZrKX",
        name: "Mirre Snelting",
        fullName: "Mirre Snelting",
        email: "mirresnelting@gmail.com",
        specialty: "CrossFit Coach",
        experience: "1-2 years",
        location: "vienna",
        phone: "+436602101427",
        isActive: true,
        status: "active",
      },
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
            description: "High-intensity functional fitness training",
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
        ],
        contact: {
          email: "mirresnelting@gmail.com",
          phone: "+436602101427",
          location: "Vienna",
        },
      },
    },
  }

  return (
    mockTrainers[trainerId] || {
      trainer: {
        id: trainerId,
        name: "Alex Johnson",
        specialty: "Personal Training",
        experience: "5+ years",
        location: "New York, NY",
        isActive: true,
        status: "active",
      },
      content: {
        hero: {
          title: "Transform Your Fitness with Alex Johnson",
          subtitle: "Professional Personal Trainer in New York, NY",
          description:
            "With 5+ years of experience, I help clients achieve their fitness goals through personalized training programs.",
        },
        about: {
          title: "About Me",
          content:
            "I'm Alex Johnson, a certified Personal Trainer based in New York. I specialize in strength training and weight loss programs.",
        },
        services: [
          {
            title: "Personal Training",
            description: "One-on-one sessions tailored to your goals",
            price: "€80",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: "Alex's training has completely transformed my fitness journey!",
            rating: 5,
          },
        ],
        contact: {
          email: "alex@example.com",
          phone: "+1 555 123 4567",
          location: "New York, NY",
        },
      },
    }
  )
}
