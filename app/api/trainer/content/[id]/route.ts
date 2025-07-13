import { type NextRequest, NextResponse } from "next/server"
import { getTrainer, updateTrainerContent, generateDefaultContent } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import type { TrainerContent } from "@/types/trainer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    logger.info("Fetching trainer content", { trainerId: id })

    const trainer = await getTrainer(id)
    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // If no custom content exists, generate default content
    let content = trainer.content
    if (!content) {
      content = generateDefaultContent(trainer)
      logger.info("Generated default content for trainer", { trainerId: id })
    }

    return NextResponse.json(content)
  } catch (error) {
    logger.error("Error fetching trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    const contentData: TrainerContent = await request.json()

    // Validate required fields
    if (!contentData.heroTitle && !contentData.aboutContent) {
      return NextResponse.json({ error: "At least hero title or about content is required" }, { status: 400 })
    }

    logger.info("Updating trainer content", { trainerId: id })

    const updatedTrainer = await updateTrainerContent(id, contentData)
    if (!updatedTrainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Trainer content updated successfully", { trainerId: id })

    return NextResponse.json({
      success: true,
      content: updatedTrainer.content,
    })
  } catch (error) {
    logger.error("Error updating trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
