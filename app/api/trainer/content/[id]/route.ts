import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    logger.info("Trainer content API called", { id })

    if (!id) {
      return NextResponse.json({ success: false, error: "Trainer ID is required" }, { status: 400 })
    }

    // Check Firebase connection
    if (!db) {
      logger.error("Firebase not initialized")
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 })
    }

    // Fetch trainer document from the "trainers" collection
    const trainerRef = doc(db, "trainers", id)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      logger.error("Trainer document not found", { id })
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()
    logger.info("Trainer document retrieved", {
      id,
      status: trainerData.status,
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
    })

    // Only return active trainers for this endpoint
    if (trainerData.status !== "active" || !trainerData.isActive) {
      logger.error("Trainer not active", { id, status: trainerData.status, isActive: trainerData.isActive })
      return NextResponse.json({ success: false, error: "Trainer not available" }, { status: 404 })
    }

    // Ensure certifications is always an array
    let certifications = trainerData.certifications || ["Certified Personal Trainer"]
    if (typeof certifications === "string") {
      certifications = [certifications]
    }
    if (!Array.isArray(certifications)) {
      certifications = ["Certified Personal Trainer"]
    }

    // Return trainer data in the expected format
    const responseData = {
      id: trainerSnap.id,
      name: trainerData.fullName || trainerData.name || "Unknown Trainer",
      fullName: trainerData.fullName || trainerData.name || "Unknown Trainer",
      email: trainerData.email || "",
      phone: trainerData.phone || "",
      location: trainerData.location || "",
      specialization: trainerData.specialty || trainerData.specialization || "Personal Training",
      experience: trainerData.experience || "Less than 1 year Experience",
      bio:
        trainerData.bio ||
        `Passionate fitness professional dedicated to helping clients achieve their goals through ${trainerData.specialty || "personal training"}.`,
      certifications: certifications,
      content: trainerData.content || null,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      activatedAt: trainerData.activatedAt?.toDate?.()?.toISOString() || null,
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
      status: trainerData.status,
    }

    logger.info("Active trainer data returned successfully", { id })
    return NextResponse.json({
      success: true,
      trainer: responseData,
    })
  } catch (error) {
    logger.error("Trainer content API error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      id: params.id,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
