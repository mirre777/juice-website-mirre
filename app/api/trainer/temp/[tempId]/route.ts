import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()

  try {
    console.log("🚀 Starting temp trainer API request")

    const tempId = params.tempId
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("📋 Request parameters", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      url: request.url,
      method: request.method,
    })

    // Validate required parameters
    if (!tempId) {
      console.error("❌ Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ Missing token parameter", { tempId })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // For now, let's create mock data to test the route works
    console.log("🎭 Creating mock trainer data for testing")

    const mockTrainerData = {
      success: true,
      trainer: {
        id: tempId,
        name: "John Smith",
        fullName: "John Smith",
        email: "john.smith@example.com",
        specialization: "Personal Trainer",
        bio: "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
        experience: "8+ years experience",
        certifications: ["NASM Certified Personal Trainer", "CPR/AED Certified"],
        services: ["Personal Training", "Fitness Consultation", "Nutrition Coaching"],
        pricing: { session: 75 },
        availability: {},
        location: "New York, NY",
        phone: "+1 (555) 123-4567",
        website: "",
        socialMedia: {},
        images: [],
        testimonials: [],
        content: null,
        isActive: false,
        isPaid: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        token: token,
      },
    }

    const duration = Date.now() - startTime

    console.log("✅ Mock trainer data created successfully", {
      tempId,
      name: mockTrainerData.trainer.name,
      duration: `${duration}ms`,
    })

    return NextResponse.json(mockTrainerData)
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("💥 Temp trainer API error", {
      tempId: params?.tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      duration: `${duration}ms`,
      url: request.url,
    })

    // Always return JSON, never plain text
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        tempId: params?.tempId || "unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()

  try {
    console.log("🚀 Starting temp trainer PUT request")

    const tempId = params.tempId
    const body = await request.json()
    const { token, ...updateData } = body

    console.log("📋 PUT request parameters", {
      tempId,
      hasToken: !!token,
      updateDataKeys: Object.keys(updateData),
    })

    if (!tempId) {
      console.error("❌ PUT: Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ PUT: Missing token parameter", { tempId })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // For now, just return success for testing
    const duration = Date.now() - startTime

    console.log("✅ PUT: Mock update successful", {
      tempId,
      duration: `${duration}ms`,
      updatedFields: Object.keys(updateData),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("💥 PUT: Temp trainer error", {
      tempId: params?.tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
