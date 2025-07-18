import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import { hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!tempId) {
      return NextResponse.json(
        {
          success: false,
          error: "Trainer ID is required",
          requestId,
        },
        { status: 400 },
      )
    }

    // Check Firebase configuration
    if (!hasRealFirebaseConfig()) {
      logger.error("Firebase configuration incomplete", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable",
          requestId,
        },
        { status: 503 },
      )
    }

    logger.info("Fetching temp trainer", { requestId, tempId, hasToken: !!token })

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temp trainer not found or expired", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer preview not found or has expired",
          requestId,
        },
        { status: 404 },
      )
    }

    // Validate session token if provided
    if (token && trainer.sessionToken !== token) {
      logger.warn("Invalid session token", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid access token",
          requestId,
        },
        { status: 401 },
      )
    }

    logger.info("Successfully fetched temp trainer", {
      requestId,
      tempId,
      email: trainer.email,
      status: trainer.status,
    })

    return NextResponse.json({
      success: true,
      trainer,
      requestId,
    })
  } catch (error) {
    logger.error("Error fetching temp trainer", {
      requestId,
      tempId: params?.tempId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load trainer preview",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      { status: 500 },
    )
  }
}
