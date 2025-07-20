import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const requestId = Math.random().toString(36).substring(2, 15)
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  try {
    logger.info("=== TEMP TRAINER API GET CALLED ===", { tempId, requestId, hasToken: !!token })

    if (!tempId) {
      logger.warn("No tempId provided", { requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Temp ID is required",
          requestId,
        },
        { status: 400 },
      )
    }

    // Get trainer data (from trainers collection)
    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temp trainer not found", { tempId, requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer not found or expired",
          requestId,
        },
        { status: 404 },
      )
    }

    // Validate session token if provided
    if (token && trainer.sessionToken && token !== trainer.sessionToken) {
      logger.warn("Invalid session token", { tempId, requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid access token",
          requestId,
        },
        { status: 403 },
      )
    }

    logger.info("Successfully retrieved temp trainer", {
      tempId,
      requestId,
      email: trainer.email,
      fullName: trainer.fullName,
      status: trainer.status,
    })

    return NextResponse.json({
      success: true,
      trainer,
      requestId,
    })
  } catch (error) {
    logger.error("Error retrieving temp trainer", {
      tempId,
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve trainer data",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      { status: 500 },
    )
  }
}
