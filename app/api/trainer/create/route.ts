import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { hasFirebaseConfig } from "@/app/api/firebase-config"

export async function POST(request: NextRequest) {
  try {
    // Check Firebase config
    if (!hasFirebaseConfig()) {
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable",
        },
        { status: 503 },
      )
    }

    const formData = await request.json()

    // Validate required fields
    const required = ["fullName", "email", "location", "specialty", "experience", "bio"]
    const missing = required.filter((field) => !formData[field]?.trim())

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 },
      )
    }

    // Create temp trainer
    const tempId = await TrainerService.createTempTrainer(formData)

    return NextResponse.json({
      success: true,
      tempId,
      redirectUrl: `/marketplace/trainer/temp/${tempId}`,
      message: "Trainer profile created successfully",
    })
  } catch (error) {
    console.error("Trainer creation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create trainer profile",
      },
      { status: 500 },
    )
  }
}
