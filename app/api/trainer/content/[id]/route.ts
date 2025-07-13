import { type NextRequest, NextResponse } from "next/server"
import { getTrainer, updateTrainerContent } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content", { trainerId })

    const trainer = await getTrainer(trainerId)

    if (!trainer) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Successfully fetched trainer content", { trainerId })
    return NextResponse.json({
      trainer: trainer.data,
      content: trainer.content || null,
    })
  } catch (error) {
    logger.error("Error fetching trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const { content } = await request.json()

    logger.info("Updating trainer content", { trainerId })

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Validate content structure
    const requiredFields = ["hero", "about", "services", "contact", "seo"]
    for (const field of requiredFields) {
      if (!content[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const success = await updateTrainerContent(trainerId, content)

    if (!success) {
      logger.error("Failed to update trainer content", { trainerId })
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }

    logger.info("Successfully updated trainer content", { trainerId })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error updating trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
