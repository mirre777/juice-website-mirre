import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tempId: string }> }) {
  try {
    const { tempId } = await params
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

    // Fetch trainer document
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
      isActive: trainerData.isActive,
      isPaid: trainerData.isPaid,
    })

    // Validate session token
    if (!trainerData.sessionToken || trainerData.sessionToken !== token) {
      logger.error("Invalid session token", { tempId, providedToken: token })
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    // Check if session has expired
    const now = new Date()
    const expiresAt = trainerData.expiresAt?.toDate()

    if (!expiresAt || now > expiresAt) {
      logger.error("Session expired", { tempId, expiresAt, now })
      return NextResponse.json({ success: false, error: "Preview session has expired" }, { status: 410 })
    }

    // Return trainer data
    const responseData = {
      success: true,
      trainer: {
        id: trainerSnap.id,
        fullName: trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
        services: trainerData.services || [],
        experience: trainerData.experience,
        certifications: trainerData.certifications || [],
        bio: trainerData.bio,
        specialties: trainerData.specialties || [],
        sessionToken: trainerData.sessionToken,
        expiresAt: trainerData.expiresAt,
        isActive: trainerData.isActive,
        isPaid: trainerData.isPaid,
      },
    }

    logger.info("Temp trainer data returned successfully", { tempId })
    return NextResponse.json(responseData)
  } catch (error) {
    logger.error("Temp trainer API error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
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
