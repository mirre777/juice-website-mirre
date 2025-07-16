import { type NextRequest, NextResponse } from "next/server"
import { getTrainerById } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    console.log("=== TRAINER PROFILE PAGE INIT ===")
    console.log("Trainer ID provided:", trainerId)

    if (!trainerId) {
      console.error("No trainer ID provided")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Try to fetch trainer from Firebase
    let trainer = null
    try {
      trainer = await getTrainerById(trainerId)
      console.log("Firebase lookup result:", trainer ? "Found" : "Not found")
    } catch (error) {
      console.error("Firebase error:", error)
    }

    // If trainer found in Firebase, use real data
    if (trainer) {
      console.log("Using real trainer data from Firebase")

      // Generate content based on trainer data
      const content = {
        hero: {
          title: `Transform Your Fitness with ${trainer.fullName || trainer.name}`,
          subtitle: `Professional ${trainer.specialty || trainer.specialization} in ${trainer.location}`,
          description:
            trainer.bio ||
            `Experienced ${trainer.specialty || trainer.specialization} with ${trainer.experience} of proven results. Ready to help you achieve your fitness goals.`,
          image: "/placeholder.svg?height=600&width=800&text=Trainer+Photo",
          cta: "Book Your Session",
        },
        about: {
          title: "About Me",
          content:
            trainer.bio ||
            `I'm ${trainer.fullName || trainer.name}, a certified ${trainer.specialty || trainer.specialization} with ${trainer.experience} of experience. I specialize in helping clients achieve their fitness goals through personalized training programs.`,
          image: "/placeholder.svg?height=400&width=600&text=About+Photo",
          certifications: trainer.certifications || ["Certified Personal Trainer", "Nutrition Specialist"],
        },
        services: [
          {
            title: "Personal Training",
            description: "One-on-one training sessions tailored to your specific goals and fitness level.",
            price: "€80/session",
            duration: "60 minutes",
            image: "/placeholder.svg?height=300&width=400&text=Personal+Training",
          },
          {
            title: "Group Classes",
            description: "Small group training sessions for a more social and cost-effective approach.",
            price: "€25/session",
            duration: "45 minutes",
            image: "/placeholder.svg?height=300&width=400&text=Group+Classes",
          },
          {
            title: "Online Coaching",
            description: "Remote coaching with personalized workout plans and nutrition guidance.",
            price: "€150/month",
            duration: "Ongoing support",
            image: "/placeholder.svg?height=300&width=400&text=Online+Coaching",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: `${trainer.fullName || trainer.name} completely transformed my approach to fitness. The results speak for themselves!`,
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Sarah",
          },
          {
            name: "Mike R.",
            text: "Professional, knowledgeable, and motivating. Couldn't ask for a better trainer!",
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Mike",
          },
          {
            name: "Emma L.",
            text: "The personalized approach and attention to detail made all the difference in my fitness journey.",
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Emma",
          },
        ],
        contact: {
          email: trainer.email,
          phone: trainer.phone || "+43 123 456 789",
          location: trainer.location,
          socialMedia: {
            instagram: `@${(trainer.fullName || trainer.name).toLowerCase().replace(/\s+/g, "")}fitness`,
            facebook: `${trainer.fullName || trainer.name} Fitness`,
          },
        },
      }

      return NextResponse.json({
        success: true,
        trainer: {
          id: trainerId,
          name: trainer.fullName || trainer.name,
          email: trainer.email,
          location: trainer.location,
          specialty: trainer.specialty || trainer.specialization,
          experience: trainer.experience,
          status: trainer.status,
          isActive: trainer.isActive,
        },
        content,
      })
    }

    // Fallback to mock data for specific trainer IDs during development
    const mockTrainers = {
      IekIXvQP8TrM1hJZZrKX: {
        name: "Mirre Snelting",
        email: "mirresnelting@gmail.com",
        location: "Vienna",
        specialty: "CrossFit Coach",
        experience: "1-2 years",
        status: "active",
        isActive: true,
      },
      mQ0sMdqycqlm2Gb8N9D5: {
        name: "Alex Johnson",
        email: "alex@example.com",
        location: "New York, NY",
        specialty: "Strength Training & Weight Loss",
        experience: "5+ years",
        status: "temp",
        isActive: false,
      },
    }

    const mockTrainer = mockTrainers[trainerId as keyof typeof mockTrainers]

    if (mockTrainer) {
      console.log("Using mock trainer data for:", trainerId)

      const content = {
        hero: {
          title: `Transform Your Fitness with ${mockTrainer.name}`,
          subtitle: `Professional ${mockTrainer.specialty} in ${mockTrainer.location}`,
          description: `Experienced ${mockTrainer.specialty} with ${mockTrainer.experience} of proven results. Ready to help you achieve your fitness goals.`,
          image: "/placeholder.svg?height=600&width=800&text=Trainer+Photo",
          cta: "Book Your Session",
        },
        about: {
          title: "About Me",
          content: `I'm ${mockTrainer.name}, a certified ${mockTrainer.specialty} with ${mockTrainer.experience} of experience. I specialize in helping clients achieve their fitness goals through personalized training programs.`,
          image: "/placeholder.svg?height=400&width=600&text=About+Photo",
          certifications: ["Certified Personal Trainer", "Nutrition Specialist"],
        },
        services: [
          {
            title: "Personal Training",
            description: "One-on-one training sessions tailored to your specific goals and fitness level.",
            price: "€80/session",
            duration: "60 minutes",
            image: "/placeholder.svg?height=300&width=400&text=Personal+Training",
          },
          {
            title: "Group Classes",
            description: "Small group training sessions for a more social and cost-effective approach.",
            price: "€25/session",
            duration: "45 minutes",
            image: "/placeholder.svg?height=300&width=400&text=Group+Classes",
          },
          {
            title: "Online Coaching",
            description: "Remote coaching with personalized workout plans and nutrition guidance.",
            price: "€150/month",
            duration: "Ongoing support",
            image: "/placeholder.svg?height=300&width=400&text=Online+Coaching",
          },
        ],
        testimonials: [
          {
            name: "Sarah M.",
            text: `${mockTrainer.name} completely transformed my approach to fitness. The results speak for themselves!`,
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Sarah",
          },
          {
            name: "Mike R.",
            text: "Professional, knowledgeable, and motivating. Couldn't ask for a better trainer!",
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Mike",
          },
          {
            name: "Emma L.",
            text: "The personalized approach and attention to detail made all the difference in my fitness journey.",
            rating: 5,
            image: "/placeholder.svg?height=100&width=100&text=Emma",
          },
        ],
        contact: {
          email: mockTrainer.email,
          phone: "+43 123 456 789",
          location: mockTrainer.location,
          socialMedia: {
            instagram: `@${mockTrainer.name.toLowerCase().replace(/\s+/g, "")}fitness`,
            facebook: `${mockTrainer.name} Fitness`,
          },
        },
      }

      return NextResponse.json({
        success: true,
        trainer: mockTrainer,
        content,
      })
    }

    // If no trainer found
    console.log("No trainer found for ID:", trainerId)
    return NextResponse.json(
      {
        error: "Trainer not found",
        trainerId: trainerId,
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Error in trainer content API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
