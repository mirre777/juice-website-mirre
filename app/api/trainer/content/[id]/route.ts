import { type NextRequest, NextResponse } from "next/server"
import { updateTrainerContent, getTrainer } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import type { TrainerContent } from "@/types/trainer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content", { trainerId })

    const trainer = await getTrainer(trainerId)

    if (!trainer) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Return the trainer data with content
    return NextResponse.json(trainer)
  } catch (error) {
    logger.error("Error fetching trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const contentData: TrainerContent = await request.json()

    logger.info("Updating trainer content", { trainerId, contentData })

    // Validate required fields
    if (!contentData.heroTitle && !contentData.aboutContent) {
      return NextResponse.json({ error: "At least hero title or about content is required" }, { status: 400 })
    }

    // Update the trainer content
    const updatedTrainer = await updateTrainerContent(trainerId, contentData)

    if (!updatedTrainer) {
      logger.warn("Trainer not found for update", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Trainer content updated successfully", { trainerId })
    return NextResponse.json(updatedTrainer)
  } catch (error) {
    logger.error("Error updating trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
