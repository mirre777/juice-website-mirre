import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now()
  const trainerId = params.id

  logger.info("Fetching trainer content", { trainerId })

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

    // Get trainer document from Firestore
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

    // Check if trainer is active (for live profiles)
    if (trainerData.status === "temp") {
      logger.warn("Attempted to access temp trainer profile", { trainerId })
      return NextResponse.json(
        {
          success: false,
          error: "This is a temporary preview. Please complete payment to activate.",
        },
        { status: 403 },
      )
    }

    if (!trainerData.isActive || !trainerData.isPaid) {
      logger.warn("Attempted to access inactive trainer profile", { trainerId })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer profile is not active",
        },
        { status: 403 },
      )
    }

    // Return trainer data with content
    const responseData = {
      success: true,
      trainer: {
        id: trainerId,
        fullName: trainerData.fullName || trainerData.name,
        name: trainerData.name || trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
        specialty: trainerData.specialty || trainerData.specialization,
        specialization: trainerData.specialization || trainerData.specialty,
        experience: trainerData.experience,
        bio: trainerData.bio,
        certifications: trainerData.certifications || [],
        status: trainerData.status,
        isActive: trainerData.isActive,
        isPaid: trainerData.isPaid,
        content: trainerData.content || null,
        createdAt: trainerData.createdAt,
        activatedAt: trainerData.activatedAt,
      },
    }

    logger.info("Successfully fetched trainer content", {
      trainerId,
      hasContent: !!trainerData.content,
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
    })

    return NextResponse.json(responseData)
  } catch (error) {
    const processingTime = Date.now() - startTime

    logger.error("Error fetching trainer content", {
      trainerId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
