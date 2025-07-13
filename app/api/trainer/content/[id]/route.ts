import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    logger.info("Fetching trainer content", { trainerId })

    if (!hasRealFirebaseConfig || !db) {
      // Mock data for development
      const mockTrainer = {
        id: trainerId,
        name: "John Doe",
        email: "john@example.com",
        specialization: "Strength Training",
        experience: "5 years",
        location: "New York, NY",
        phone: "+1 (555) 123-4567",
        status: "active",
      }

      const mockContent = {
        heroTitle: `Transform Your Fitness with ${mockTrainer.name}`,
        heroSubtitle: `Professional ${mockTrainer.specialization} training tailored to your goals`,
        aboutTitle: "About Me",
        aboutDescription: `Hi, I'm ${mockTrainer.name}, a certified ${mockTrainer.specialization} trainer with ${mockTrainer.experience} of experience.`,
        services: [
          {
            id: "1",
            title: "Personal Training",
            description: "One-on-one training sessions",
            price: "€60",
            duration: "60 min",
          },
        ],
        contactEmail: mockTrainer.email,
        contactPhone: mockTrainer.phone,
        contactLocation: mockTrainer.location,
      }

      return NextResponse.json({
        trainer: mockTrainer,
        content: mockContent,
      })
    }

    // Real Firebase implementation
    const trainerRef = doc(db, "trainers", trainerId)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = { id: trainerSnap.id, ...trainerSnap.data() }

    // Get content if it exists
    const contentRef = doc(db, "trainer_content", trainerId)
    const contentSnap = await getDoc(contentRef)

    let content = null
    if (contentSnap.exists()) {
      content = contentSnap.data()
    }

    logger.info("Trainer content fetched successfully", { trainerId })

    return NextResponse.json({
      trainer: trainerData,
      content: content,
    })
  } catch (error) {
    logger.error("Error fetching trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    const content = await request.json()

    logger.info("Updating trainer content", { trainerId })

    if (!hasRealFirebaseConfig || !db) {
      // Mock response for development
      logger.info("Mock: Trainer content updated", { trainerId })
      return NextResponse.json({
        success: true,
        message: "Content updated successfully (mock mode)",
      })
    }

    // Real Firebase implementation
    const contentRef = doc(db, "trainer_content", trainerId)

    const updatedContent = {
      ...content,
      lastModified: new Date().toISOString(),
      version: (content.version || 0) + 1,
    }

    await setDoc(contentRef, updatedContent, { merge: true })

    logger.info("Trainer content updated successfully", { trainerId })

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    logger.error("Error updating trainer content", { error, trainerId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
