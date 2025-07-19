import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    logger.info("=== TEMP TRAINER API GET CALLED ===", { tempId, requestId })

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

    // Get temp trainer data
    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temp trainer not found", { tempId, requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer not found",
          requestId,
        },
        { status: 404 },
      )
    }

    logger.info("Successfully retrieved temp trainer", {
      tempId,
      requestId,
      email: trainer.email,
      fullName: trainer.fullName,
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
