import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content", { trainerId })

    const trainer = await TrainerService.getTrainer(trainerId)

    if (!trainer) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Trainer content fetched successfully", { trainerId })
    return NextResponse.json({ trainer })
  } catch (error) {
    logger.error("Error fetching trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const { content } = await request.json()

    logger.info("Updating trainer content", { trainerId, contentKeys: Object.keys(content) })

    // Validate content structure
    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Invalid content format" }, { status: 400 })
    }

    const updatedTrainer = await TrainerService.updateTrainerContent(trainerId, content)

    if (!updatedTrainer) {
      logger.warn("Trainer not found for update", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Trainer content updated successfully", { trainerId })
    return NextResponse.json({
      success: true,
      trainer: updatedTrainer,
    })
  } catch (error) {
    logger.error("Error updating trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
