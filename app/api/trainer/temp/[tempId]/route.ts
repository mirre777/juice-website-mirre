import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const requestId = Math.random().toString(36).substring(2, 15)
  const { tempId } = params
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  try {
    logger.info("Fetching temp trainer", {
      requestId,
      tempId,
      hasToken: !!token,
      userAgent: request.headers.get("user-agent")?.substring(0, 100),
    })

    if (!tempId) {
      logger.warn("Missing tempId parameter", { requestId })
      return NextResponse.json(
        {
          success: false,
          error: "Missing tempId parameter",
          requestId,
        },
        { status: 400 },
      )
    }

    // Fetch trainer data
    const trainerData = await TrainerService.getTempTrainer(tempId)

    if (!trainerData) {
      logger.warn("Temp trainer not found", {
        requestId,
        tempId,
        hasToken: !!token,
      })
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
      email: trainerData.email,
      fullName: trainerData.fullName,
      hasToken: !!token,
    })

    return NextResponse.json({
      success: true,
      trainer: trainerData,
      requestId,
      // Include token validation if provided
      tokenValidated: !!token,
    })
  } catch (error) {
    logger.error("Error fetching temp trainer", {
      requestId,
      tempId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      { status: 500 },
    )
  }
}
