import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"
import type { TempTrainerData } from "@/types/trainer"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    logger.info("Fetching temp trainer data", { tempId })

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      logger.warn("Temp trainer not found", { tempId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Convert to TempTrainerData format
    const tempTrainerData: TempTrainerData = {
      tempId: trainer.id,
      name: trainer.fullName,
      email: trainer.email,
      phone: trainer.phone,
      location: trainer.location,
      specialization: trainer.specialty,
      experience: trainer.experience,
      bio: trainer.bio,
      certifications: trainer.certifications,
      createdAt: trainer.createdAt.toISOString(),
      expiresAt: new Date(trainer.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from creation
    }

    logger.info("Successfully fetched temp trainer data", {
      tempId,
      name: tempTrainerData.name,
    })

    return NextResponse.json({
      success: true,
      trainer: tempTrainerData,
    })
  } catch (error) {
    logger.error("Error fetching temp trainer data", {
      error: error instanceof Error ? error.message : "Unknown error",
      tempId: params.tempId,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
