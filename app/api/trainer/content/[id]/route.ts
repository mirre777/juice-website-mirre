import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id

    console.log("🔍 GET /api/trainer/content/[id] called", {
      trainerId,
      url: request.url,
    })

    if (!trainerId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    // Return mock content data for now
    const mockContent = {
      id: trainerId,
      hero: {
        title: "Transform Your Body, Transform Your Life",
        subtitle: "Professional Personal Training Services",
        backgroundImage: "/placeholder.svg?height=600&width=1200&text=Hero+Background",
        cta: "Book Your Free Consultation",
      },
      about: {
        title: "About Your Trainer",
        description:
          "Dedicated fitness professional with years of experience helping clients achieve their health and wellness goals.",
        image: "/placeholder.svg?height=400&width=400&text=Trainer+Photo",
      },
      services: [
        {
          name: "Personal Training",
          description: "One-on-one training sessions tailored to your specific goals",
          price: 75,
          duration: 60,
          image: "/placeholder.svg?height=300&width=400&text=Personal+Training",
        },
        {
          name: "Group Classes",
          description: "Small group fitness classes for motivation and community",
          price: 30,
          duration: 45,
          image: "/placeholder.svg?height=300&width=400&text=Group+Classes",
        },
        {
          name: "Nutrition Coaching",
          description: "Personalized nutrition plans and ongoing support",
          price: 100,
          duration: 90,
          image: "/placeholder.svg?height=300&width=400&text=Nutrition+Coaching",
        },
      ],
      testimonials: [
        {
          name: "Sarah M.",
          rating: 5,
          text: "Amazing results in just 3 months! Highly recommend.",
          image: "/placeholder.svg?height=100&width=100&text=Sarah",
        },
        {
          name: "Mike R.",
          rating: 5,
          text: "Professional, knowledgeable, and motivating trainer.",
          image: "/placeholder.svg?height=100&width=100&text=Mike",
        },
      ],
      contact: {
        email: "trainer@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        socialMedia: {
          instagram: "@trainerhandle",
          facebook: "Trainer Page",
        },
      },
      gallery: [
        "/placeholder.svg?height=300&width=400&text=Gallery+1",
        "/placeholder.svg?height=300&width=400&text=Gallery+2",
        "/placeholder.svg?height=300&width=400&text=Gallery+3",
        "/placeholder.svg?height=300&width=400&text=Gallery+4",
      ],
    }

    console.log("✅ Returning mock content data")

    return NextResponse.json({
      success: true,
      content: mockContent,
    })
  } catch (error) {
    console.error("💥 Error in GET /api/trainer/content/[id]:", error)

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
