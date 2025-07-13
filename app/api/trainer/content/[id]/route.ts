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

    // Return trainer data with content for editing
    const response = {
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      specialization: trainer.specialization,
      experience: trainer.experience,
      location: trainer.location,
      bio: trainer.bio,
      heroTitle: trainer.content?.heroTitle || `Transform Your Fitness with ${trainer.name}`,
      heroSubtitle:
        trainer.content?.heroSubtitle ||
        `Professional ${trainer.specialization} trainer with ${trainer.experience} years of experience in ${trainer.location}`,
      aboutTitle: trainer.content?.aboutTitle || "About Me",
      aboutContent: trainer.content?.aboutContent || trainer.bio,
      services: trainer.content?.services || TrainerService.generateDefaultServices(trainer),
      contactTitle: trainer.content?.contactTitle || "Get in Touch",
      contactDescription:
        trainer.content?.contactDescription ||
        "Ready to start your fitness journey? Contact me to schedule your first session.",
      seoTitle:
        trainer.content?.seoTitle || `${trainer.name} - ${trainer.specialization} Trainer in ${trainer.location}`,
      seoDescription:
        trainer.content?.seoDescription ||
        `Professional ${trainer.specialization} training with ${trainer.name}. ${trainer.experience} years experience in ${trainer.location}. Book your session today!`,
      lastModified: trainer.content?.lastModified || new Date().toISOString(),
      version: trainer.content?.version || 1,
    }

    logger.info("Trainer content fetched successfully", { trainerId })
    return NextResponse.json(response)
  } catch (error) {
    logger.error("Error fetching trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const contentData = await request.json()

    logger.info("Updating trainer content", { trainerId })

    // Validate required fields
    if (!contentData.heroTitle || !contentData.aboutContent) {
      return NextResponse.json({ error: "Missing required content fields" }, { status: 400 })
    }

    // Update trainer content
    const success = await TrainerService.updateTrainerContent(trainerId, {
      heroTitle: contentData.heroTitle,
      heroSubtitle: contentData.heroSubtitle,
      aboutTitle: contentData.aboutTitle,
      aboutContent: contentData.aboutContent,
      services: contentData.services || [],
      contactTitle: contentData.contactTitle,
      contactDescription: contentData.contactDescription,
      seoTitle: contentData.seoTitle,
      seoDescription: contentData.seoDescription,
      lastModified: new Date().toISOString(),
      version: (contentData.version || 1) + 1,
    })

    if (!success) {
      logger.error("Failed to update trainer content", { trainerId })
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }

    logger.info("Trainer content updated successfully", { trainerId })
    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
      lastModified: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error updating trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
