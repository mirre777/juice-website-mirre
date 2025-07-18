import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import { hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    logger.info("Fetching temp trainer", { tempId, requestId })

    // Check Firebase configuration
    if (!hasRealFirebaseConfig()) {
      logger.error("Firebase configuration incomplete", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Service configuration error",
          requestId,
        },
        { status: 500 },
      )
    }

    // Get temp trainer data
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

    logger.info("Successfully retrieved temp trainer", {
      tempId,
      requestId,
      email: trainer.email,
    })

    return NextResponse.json({
      success: true,
      trainer,
      requestId,
    })
  } catch (error) {
    logger.error("Error fetching temp trainer", {
      tempId,
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load trainer data",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      { status: 500 },
    )
  }
}
