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

    // **NEW: Ensure content exists, generate if missing**
    let content = trainer.content
    if (!content) {
      logger.info("No content found, generating default content", { trainerId: id })
      content = generateDefaultContentFromTrainer(trainer)

      // Save the generated content
      await TrainerService.updateTrainerContent(id, content)
    }

    logger.info("Successfully fetched trainer content for editing", {
      trainerId: id,
      hasContent: !!content,
      contentSections: content ? Object.keys(content) : [],
    })

    return NextResponse.json({
      trainer: {
        ...trainer,
        content, // Ensure content is included
      },
      content,
    })
  } catch (error) {
    logger.error("Error fetching trainer content for editing", {
      error: error instanceof Error ? error.message : "Unknown error",
      trainerId: params.id,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to generate content from trainer data
function generateDefaultContentFromTrainer(trainer: any) {
  const name = trainer.name || trainer.fullName
  const specialty = trainer.specialization || trainer.specialty

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialty} Training • ${trainer.experience}`,
      description: `Welcome! I'm ${name}, a certified personal trainer specializing in ${specialty}. With ${trainer.experience} of experience, I'm here to help you achieve your fitness goals.`,
    },
    about: {
      title: "About Me",
      content:
        trainer.bio ||
        `I'm ${name}, a passionate fitness professional with ${trainer.experience} of experience in ${specialty}.`,
    },
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session",
        price: 60,
        duration: "60 minutes",
        featured: true,
      },
    ],
    contact: {
      title: "Let's Start Your Fitness Journey",
      description: "Ready to transform your fitness? Get in touch to schedule your first session.",
      email: trainer.email,
      phone: trainer.phone || "",
      location: trainer.location,
    },
    seo: {
      title: `${name} - Personal Trainer in ${trainer.location}`,
      description: `Professional ${specialty} training with ${name}. Transform your fitness with personalized programs.`,
    },
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
