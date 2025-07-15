import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const trainerId = params.id
  const startTime = Date.now()

  logger.info("Trainer content API called", {
    trainerId,
    timestamp: new Date().toISOString(),
  })

  try {
    if (!trainerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Trainer ID is required",
        },
        { status: 400 },
      )
    }

    // Get trainer document from Firebase
    const trainerRef = doc(db, "trainers", trainerId)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      logger.warn("Trainer not found", { trainerId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer not found",
        },
        { status: 404 },
      )
    }

    const trainerData = trainerSnap.data()

    // Check if trainer is active
    if (trainerData.status === "temp") {
      logger.info("Temporary trainer accessed", {
        trainerId,
        status: trainerData.status,
        isActive: trainerData.isActive,
        isPaid: trainerData.isPaid,
      })

      return NextResponse.json(
        {
          success: false,
          error: "This is a temporary preview. Please complete payment to activate your profile.",
          isTemp: true,
          trainer: {
            id: trainerId,
            fullName: trainerData.fullName,
            name: trainerData.fullName,
            email: trainerData.email,
            phone: trainerData.phone,
            location: trainerData.location,
            specialty: trainerData.specialty,
            specialization: trainerData.specialty,
            experience: trainerData.experience,
            bio: trainerData.bio,
            certifications: trainerData.certifications || [],
            status: trainerData.status,
            isActive: trainerData.isActive || false,
            isPaid: trainerData.isPaid || false,
          },
        },
        { status: 200 },
      )
    }

    if (!trainerData.isActive || !trainerData.isPaid) {
      logger.warn("Inactive trainer accessed", {
        trainerId,
        isActive: trainerData.isActive,
        isPaid: trainerData.isPaid,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Trainer profile is not active",
        },
        { status: 403 },
      )
    }

    // Return active trainer with content
    const trainer = {
      id: trainerId,
      fullName: trainerData.fullName,
      name: trainerData.fullName,
      email: trainerData.email,
      phone: trainerData.phone,
      location: trainerData.location,
      specialty: trainerData.specialty,
      specialization: trainerData.specialty,
      experience: trainerData.experience,
      bio: trainerData.bio,
      certifications: trainerData.certifications || [],
      status: trainerData.status,
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
      content: trainerData.content || null,
    }

    logger.info("Trainer content retrieved successfully", {
      trainerId,
      hasContent: !!trainerData.content,
      processingTime: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    logger.error("Error fetching trainer content", {
      trainerId,
      error: error instanceof Error ? error.message : String(error),
      processingTime: Date.now() - startTime,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trainer information",
      },
      { status: 500 },
    )
  }
}
