import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const requestId = Math.random().toString(36).substring(2, 15)

  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    logger.info("Fetching temporary trainer", {
      requestId,
      tempId,
      hasToken: !!token,
    })

    if (!tempId) {
      logger.warn("Missing tempId parameter", { requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Missing trainer ID",
          requestId,
        },
        { status: 400 },
      )
    }

    // Get temporary trainer from Firebase
    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temporary trainer not found", { requestId, tempId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer preview not found",
          requestId,
        },
        { status: 404 },
      )
    }

    logger.info("Successfully retrieved temporary trainer", {
      requestId,
      tempId,
      status: trainer.status,
      email: trainer.email,
    })

    return NextResponse.json({
      success: true,
      trainer,
      requestId,
    })
  } catch (error) {
    logger.error("Error fetching temporary trainer", {
      requestId,
      tempId: params.tempId,
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
