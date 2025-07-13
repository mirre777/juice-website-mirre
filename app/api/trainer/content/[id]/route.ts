import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import type { TrainerContent } from "@/types/trainer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content for editing", { trainerId })

    const trainer = await TrainerService.getTrainer(trainerId)
    if (!trainer) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Check if trainer is active
    if (trainer.status !== "active") {
      logger.warn("Trainer not active", { trainerId, status: trainer.status })
      return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
    }

    logger.info("Trainer content fetched successfully", {
      trainerId,
      hasContent: !!trainer.content,
    })

    return NextResponse.json({
      trainer,
      content: trainer.content || null,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Failed to fetch trainer content", {
      trainerId: params.id,
      error: errorMessage,
    })

    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const body = await request.json()
    const { content } = body as { content: TrainerContent }

    logger.info("Updating trainer content", { trainerId })

    // Validate content structure
    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Invalid content data" }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = ["hero", "about", "services", "contact", "seo"]
    for (const field of requiredFields) {
      if (!content[field as keyof TrainerContent]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate services array
    if (!Array.isArray(content.services)) {
      return NextResponse.json({ error: "Services must be an array" }, { status: 400 })
    }

    // Validate each service
    for (const service of content.services) {
      if (!service.id || !service.title || !service.description || !service.price) {
        return NextResponse.json({ error: "Each service must have id, title, description, and price" }, { status: 400 })
      }
    }

    // Check if trainer exists and is active
    const trainer = await TrainerService.getTrainer(trainerId)
    if (!trainer) {
      logger.warn("Trainer not found for content update", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    if (trainer.status !== "active") {
      logger.warn("Trainer not active for content update", {
        trainerId,
        status: trainer.status,
      })
      return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
    }

    // Update trainer content
    const updatedTrainer = await TrainerService.updateTrainerContent(trainerId, content)

    logger.info("Trainer content updated successfully", {
      trainerId,
      contentVersion: updatedTrainer.content?.version || 1,
    })

    return NextResponse.json({
      success: true,
      trainer: updatedTrainer,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Failed to update trainer content", {
      trainerId: params.id,
      error: errorMessage,
    })

    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
