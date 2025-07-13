import { type NextRequest, NextResponse } from "next/server"
import { getTrainer, updateTrainerContent } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    const trainer = await getTrainer(id)

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Return trainer data with content
    return NextResponse.json({
      success: true,
      trainer,
      content: trainer.content || {},
    })
  } catch (error) {
    logger.error("Error fetching trainer content:", error)
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

    // Update trainer content
    const updatedTrainer = await updateTrainerContent(id, content)

    if (!updatedTrainer) {
      return NextResponse.json({ error: "Trainer not found or update failed" }, { status: 404 })
    }

    logger.info(`Trainer content updated: ${id}`)

    return NextResponse.json({
      success: true,
      trainer: updatedTrainer,
    })
  } catch (error) {
    logger.error("Error updating trainer content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
