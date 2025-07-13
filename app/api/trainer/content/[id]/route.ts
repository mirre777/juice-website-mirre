import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import type { TrainerContent } from "@/types/trainer"

const trainerService = new TrainerService()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content", { trainerId })

    const trainer = await trainerService.getTrainer(trainerId)

    if (!trainer) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Return content if it exists, otherwise generate default content
    const content = trainer.content || (await trainerService.generateDefaultContent(trainer))

    logger.info("Trainer content fetched successfully", { trainerId })
    return NextResponse.json(content)
  } catch (error) {
    logger.error("Error fetching trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const contentData: TrainerContent = await request.json()

    logger.info("Updating trainer content", { trainerId })

    // Validate required fields
    if (!contentData.heroTitle && !contentData.aboutContent) {
      return NextResponse.json({ error: "At least hero title or about content is required" }, { status: 400 })
    }

    // Update content with version control
    const updatedContent = {
      ...contentData,
      updatedAt: new Date().toISOString(),
      version: (contentData.version || 0) + 1,
    }

    const success = await trainerService.updateTrainerContent(trainerId, updatedContent)

    if (!success) {
      logger.error("Failed to update trainer content", { trainerId })
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }

    logger.info("Trainer content updated successfully", { trainerId, version: updatedContent.version })
    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    logger.error("Error updating trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
