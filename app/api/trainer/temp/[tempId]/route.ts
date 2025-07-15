import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const tempId = params.tempId

    console.log("🔍 GET /api/trainer/temp/[tempId] called", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      url: request.url,
    })

    // Validate required parameters
    if (!tempId) {
      console.error("❌ Missing tempId parameter")
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ Missing token parameter")
      return NextResponse.json({ success: false, error: "Missing access token" }, { status: 401 })
    }

    // For now, return mock data to avoid Firebase issues during deployment
    // This will be replaced with actual Firebase calls once deployment is stable
    const mockTrainerData = {
      id: tempId,
      name: "Alex Johnson",
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      specialization: "Strength Training & Weight Loss",
      experience: "5+ years experience",
      bio: "Passionate fitness trainer dedicated to helping clients achieve their health and wellness goals. Specializing in strength training, weight loss, and functional movement patterns.",
      certifications: ["NASM Certified Personal Trainer", "Precision Nutrition Level 1", "FMS Certified"],
      services: ["Personal Training", "Group Fitness Classes", "Nutrition Coaching", "Online Training Programs"],
      pricing: {
        session: 75,
        package: 300,
        monthly: 800,
      },
      availability: {
        monday: "6:00 AM - 8:00 PM",
        tuesday: "6:00 AM - 8:00 PM",
        wednesday: "6:00 AM - 8:00 PM",
        thursday: "6:00 AM - 8:00 PM",
        friday: "6:00 AM - 6:00 PM",
        saturday: "8:00 AM - 4:00 PM",
        sunday: "Closed",
      },
      website: "https://alexjohnsontraining.com",
      socialMedia: {
        instagram: "@alexjohnsonfit",
        facebook: "Alex Johnson Training",
        youtube: "Alex Johnson Fitness",
      },
      images: [
        "/placeholder.svg?height=400&width=600&text=Trainer+Photo",
        "/placeholder.svg?height=300&width=400&text=Gym+Setup",
        "/placeholder.svg?height=300&width=400&text=Training+Session",
      ],
      testimonials: [
        {
          name: "Sarah M.",
          rating: 5,
          text: "Alex helped me lose 30 pounds and gain confidence I never had before!",
        },
        {
          name: "Mike R.",
          rating: 5,
          text: "Professional, knowledgeable, and motivating. Highly recommend!",
        },
      ],
      content: {
        hero: {
          title: "Transform Your Body, Transform Your Life",
          subtitle: "Professional Personal Training in New York",
          cta: "Book Your Free Consultation",
        },
        about: {
          title: "About Alex Johnson",
          description:
            "With over 5 years of experience in the fitness industry, I'm committed to helping you achieve your health and wellness goals through personalized training programs.",
        },
      },
      isActive: false,
      isPaid: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      token: token,
    }

    console.log("✅ Returning mock trainer data", {
      trainerName: mockTrainerData.name,
      trainerEmail: mockTrainerData.email,
    })

    return NextResponse.json({
      success: true,
      trainer: mockTrainerData,
    })
  } catch (error) {
    console.error("💥 Error in GET /api/trainer/temp/[tempId]:", error)

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
