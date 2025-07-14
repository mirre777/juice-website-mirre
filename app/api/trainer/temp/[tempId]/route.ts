import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    logger.info("Temp trainer API called", { tempId, hasToken: !!token })

    // Validate required parameters
    if (!tempId) {
      logger.error("Missing tempId parameter")
      return NextResponse.json({ success: false, error: "Trainer ID is required" }, { status: 400 })
    }

    if (!token) {
      logger.error("Missing token parameter", { tempId })
      return NextResponse.json({ success: false, error: "Access token is required" }, { status: 401 })
    }

    // Check Firebase connection
    if (!db) {
      logger.error("Firebase not initialized")
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 })
    }

    // Fetch trainer document from the "trainers" collection (not "tempTrainers")
    logger.info("Fetching trainer document", { tempId })
    const trainerRef = doc(db, "trainers", tempId)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      logger.error("Trainer document not found", { tempId })
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()
    logger.info("Trainer document retrieved", {
      tempId,
      hasSessionToken: !!trainerData.sessionToken,
      status: trainerData.status,
    })

    // Validate session token
    if (!trainerData.sessionToken || trainerData.sessionToken !== token) {
      logger.error("Invalid session token", { tempId, providedToken: token })
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    // Check if session has expired (24 hours from creation)
    const now = new Date()
    const createdAt = trainerData.createdAt?.toDate() || new Date()
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    if (now > expiresAt) {
      logger.error("Session expired", { tempId, expiresAt, now })
      return NextResponse.json({ success: false, error: "Preview session has expired" }, { status: 410 })
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
      certifications: trainerData.certifications || ["Certified Personal Trainer"],
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: trainerData.status === "active",
      sessionToken: trainerData.sessionToken,
    }

    logger.info("Temp trainer data returned successfully", { tempId })
    return NextResponse.json({
      success: true,
      trainer: responseData,
    })
  } catch (error) {
    logger.error("Temp trainer API error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      tempId: params.tempId,
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
