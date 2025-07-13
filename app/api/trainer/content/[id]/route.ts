import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    logger.info("Fetching trainer content", { trainerId: id })

    const trainer = await TrainerService.getTrainer(id)

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Return trainer data with content
    return NextResponse.json(trainer)
  } catch (error) {
    logger.error("Error fetching trainer content", { error, trainerId: await params.then((p) => p.id) })
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    const contentData = await request.json()

    logger.info("Updating trainer content", { trainerId: id, contentKeys: Object.keys(contentData) })

    // Validate required fields
    if (!contentData.heroTitle && !contentData.aboutContent) {
      return NextResponse.json({ error: "At least hero title or about content is required" }, { status: 400 })
    }

    const updatedTrainer = await TrainerService.updateTrainerContent(id, contentData)

    if (!updatedTrainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    logger.info("Trainer content updated successfully", { trainerId: id })

    return NextResponse.json(updatedTrainer)
  } catch (error) {
    logger.error("Error updating trainer content", { error, trainerId: await params.then((p) => p.id) })
    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
