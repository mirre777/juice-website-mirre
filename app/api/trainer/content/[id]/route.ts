import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    logger.info("Fetching trainer content for editing", { trainerId: id })

    const trainer = await TrainerService.getTrainer(id)

    if (!trainer) {
      logger.warn("Trainer not found for content editing", { trainerId: id })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Check if trainer is active
    if (trainer.status !== "active") {
      logger.warn("Attempted to edit inactive trainer content", {
        trainerId: id,
        status: trainer.status,
      })
      return NextResponse.json({ error: "Only active trainers can edit content" }, { status: 403 })
    }

    logger.info("Successfully fetched trainer content for editing", {
      trainerId: id,
      hasContent: !!trainer.content,
    })

    return NextResponse.json({
      trainer,
      content: trainer.content,
    })
  } catch (error) {
    logger.error("Error fetching trainer content for editing", {
      error: error instanceof Error ? error.message : "Unknown error",
      trainerId: params.id,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { content } = body

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    logger.info("Updating trainer content", { trainerId: id })

    // Verify trainer exists and is active
    const trainer = await TrainerService.getTrainer(id)

    if (!trainer) {
      logger.warn("Trainer not found for content update", { trainerId: id })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    if (trainer.status !== "active") {
      logger.warn("Attempted to update inactive trainer content", {
        trainerId: id,
        status: trainer.status,
      })
      return NextResponse.json({ error: "Only active trainers can edit content" }, { status: 403 })
    }

    // Update trainer content
    const updatedTrainer = await TrainerService.updateTrainerContent(id, content)

    logger.info("Successfully updated trainer content", {
      trainerId: id,
      contentSections: Object.keys(content),
    })

    return NextResponse.json({
      success: true,
      trainer: updatedTrainer,
    })
  } catch (error) {
    logger.error("Error updating trainer content", {
      error: error instanceof Error ? error.message : "Unknown error",
      trainerId: params.id,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
