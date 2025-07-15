import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    logger.info("Fetching trainer content", { trainerId: id })

    // Get trainer document
    const trainerRef = doc(db, "trainers", id)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()

    // Check if trainer is active
    if (trainerData.status !== "active" || !trainerData.isActive) {
      return NextResponse.json({ error: "Trainer not active" }, { status: 403 })
    }

    // Return trainer content
    return NextResponse.json({
      success: true,
      trainer: {
        id: id,
        name: trainerData.name,
        fullName: trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
        specialization: trainerData.specialization,
        experience: trainerData.experience,
        bio: trainerData.bio,
        certifications: trainerData.certifications,
        services: trainerData.services,
        status: trainerData.status,
        isActive: trainerData.isActive,
        isPaid: trainerData.isPaid,
        content: trainerData.content,
        createdAt: trainerData.createdAt,
        updatedAt: trainerData.updatedAt,
      },
    })
  } catch (error) {
    logger.error("Failed to fetch trainer content", {
      trainerId: params.id,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}
