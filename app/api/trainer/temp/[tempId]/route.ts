import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import { hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json(
        {
          success: false,
          error: "Temp ID is required",
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
          error: "Service configuration error",
          requestId,
        },
        { status: 500 },
      )
    }

    logger.info("Fetching temp trainer", { requestId, tempId })

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temp trainer not found", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer not found",
          requestId,
        },
        { status: 404 },
      )
    }

    logger.info("Successfully fetched temp trainer", {
      requestId,
      tempId,
      email: trainer.email,
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
