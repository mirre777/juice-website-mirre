import { type NextRequest, NextResponse } from "next/server"
import { getTrainerById } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    console.log("[TRAINER-CONTENT] Fetching content for trainer:", trainerId)

    // Try to get trainer from Firebase
    let trainer = null
    try {
      trainer = await getTrainerById(trainerId)
    } catch (firebaseError) {
      console.error("[TRAINER-CONTENT] Firebase error:", firebaseError)
      // Continue with mock data if Firebase fails
    }

    if (trainer) {
      console.log("[TRAINER-CONTENT] Trainer found in Firebase:", trainer.fullName || trainer.name)

      // Generate content based on Firebase data
      const content = {
        hero: {
          title: `Transform Your Fitness with ${trainer.fullName || trainer.name}`,
          subtitle: `${trainer.specialty || "Personal Training"} • ${trainer.experience || "5+ years experience"} • ${trainer.location || "Available Online"}`,
          description:
            trainer.bio ||
            `Professional ${trainer.specialty || "personal trainer"} dedicated to helping you achieve your fitness goals.`,
          image: trainer.profileImage || "/placeholder.svg?height=400&width=600&text=Trainer+Photo",
        },
        about: {
          title: "About Me",
          content:
            trainer.bio ||
            `Hi, I'm ${trainer.fullName || trainer.name}! I'm a certified ${trainer.specialty || "personal trainer"} with ${trainer.experience || "5+ years"} of experience helping clients achieve their fitness goals.`,
          image: trainer.profileImage || "/placeholder.svg?height=300&width=400&text=About+Photo",
        },
        services: trainer.services || [
          {
            title: trainer.specialty || "Personal Training",
            description: "Customized workout plans tailored to your goals",
            price: "€80/session",
          },
        ],
        testimonials: trainer.testimonials || [
          {
            name: "Client Review",
            text: `${trainer.fullName || trainer.name} is an amazing trainer! Highly recommended.`,
            rating: 5,
          },
        ],
        contact: {
          email: trainer.email || "contact@trainer.com",
          phone: trainer.phone || "+1234567890",
          location: trainer.location || "Available Online",
        },
      }

      return NextResponse.json({
        success: true,
        content,
        trainer: {
          id: trainer.id,
          name: trainer.fullName || trainer.name,
          specialty: trainer.specialty,
          location: trainer.location,
          isActive: trainer.isActive,
        },
      })
    }

    // Mock data for specific trainer IDs
    const mockTrainers: Record<string, any> = {
      IekIXvQP8TrM1hJZZrKX: {
        hero: {
          title: "Transform Your Fitness with Mirre Snelting",
          subtitle: "CrossFit Coach • 1-2 years experience • Vienna",
          description:
            "Professional CrossFit coach dedicated to helping you achieve your fitness goals through functional movements and high-intensity workouts.",
          image: "/placeholder.svg?height=400&width=600&text=CrossFit+Coach",
        },
        about: {
          title: "About Me",
          content:
            "Hi, I'm Mirre Snelting! I'm a certified CrossFit coach with 1-2 years of experience helping clients build strength, endurance, and confidence through functional fitness.",
          image: "/placeholder.svg?height=300&width=400&text=About+Mirre",
        },
        services: [
          {
            title: "CrossFit Training",
            description: "High-intensity functional movement workouts",
            price: "€75/session",
          },
          {
            title: "Group Fitness",
            description: "Small group training sessions",
            price: "€45/session",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: "Mirre's CrossFit classes are challenging but so rewarding! I've never felt stronger.",
            rating: 5,
          },
        ],
        contact: {
          email: "mirresnelting@gmail.com",
          phone: "+436602101427",
          location: "Vienna",
        },
      },
    }

    if (mockTrainers[trainerId]) {
      console.log("[TRAINER-CONTENT] Using mock data for trainer:", trainerId)
      return NextResponse.json({
        success: true,
        content: mockTrainers[trainerId],
        trainer: {
          id: trainerId,
          name: "Mirre Snelting",
          specialty: "CrossFit Coach",
          location: "Vienna",
          isActive: true,
        },
      })
    }

    console.log("[TRAINER-CONTENT] Trainer not found:", trainerId)
    return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
  } catch (error) {
    console.error("[TRAINER-CONTENT] Error fetching trainer content:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
