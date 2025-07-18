import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import { hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    // Check if Firebase is properly configured
    if (!hasRealFirebaseConfig()) {
      logger.error("Firebase configuration incomplete", { requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable. Please try again later.",
          requestId,
        },
        { status: 503 },
      )
    }

    const formData = await request.json()
    logger.info("Received trainer creation request", {
      requestId,
      email: formData.email,
      fullName: formData.fullName,
      specialty: formData.specialty,
      location: formData.location,
    })

    // Validate required fields
    const requiredFields = ["fullName", "email", "location", "specialty", "experience", "bio"]
    const missingFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "")

    if (missingFields.length > 0) {
      logger.warn("Missing required fields", { requestId, missingFields })
      return NextResponse.json(
        {
          success: false,
          error: "Please fill in all required fields",
          details: `Missing: ${missingFields.join(", ")}`,
          requestId,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address",
          requestId,
        },
        { status: 400 },
      )
    }

    // Create temporary trainer
    const tempId = await TrainerService.createTempTrainer(formData)

    const redirectUrl = `/marketplace/trainer/temp/${tempId}`

    logger.info("Successfully created temporary trainer", {
      requestId,
      tempId,
      email: formData.email,
      redirectUrl,
    })

    return NextResponse.json({
      success: true,
      tempId,
      redirectUrl,
      message: "Trainer profile created successfully",
      requestId,
    })
  } catch (error) {
    logger.error("Error creating trainer", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create trainer profile. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      { status: 500 },
    )
  }
}
