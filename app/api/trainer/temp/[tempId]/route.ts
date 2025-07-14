import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tempId: string }> }) {
  try {
    const { tempId } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    logger.info("API: Fetching temp trainer", { tempId, hasToken: !!token })

    // Validate required parameters
    if (!tempId) {
      logger.error("API: Missing tempId parameter")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Check Firebase connection
    if (!db) {
      logger.error("API: Firebase not initialized")
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get trainer document
    const trainerRef = doc(db, "trainers", tempId)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      logger.error("API: Trainer not found", { tempId })
      return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()
    logger.info("API: Trainer data retrieved", {
      tempId,
      hasData: !!trainerData,
      isActive: trainerData?.isActive,
    })

    // Check if trainer is still in temp state (not activated)
    if (trainerData.isActive) {
      logger.error("API: Trainer already activated", { tempId })
      return NextResponse.json({ error: "This trainer profile has already been activated" }, { status: 403 })
    }

    // Check expiration
    const now = new Date()
    const expiresAt = trainerData.expiresAt?.toDate()

    if (expiresAt && now > expiresAt) {
      logger.error("API: Trainer profile expired", { tempId, expiresAt })
      return NextResponse.json({ error: "This preview has expired" }, { status: 410 })
    }

    // Validate token if provided (basic validation)
    if (token && trainerData.accessToken && token !== trainerData.accessToken) {
      logger.error("API: Invalid access token", { tempId })
      return NextResponse.json({ error: "Invalid access token" }, { status: 403 })
    }

    // Return trainer data
    const responseData = {
      id: trainerSnap.id,
      fullName: trainerData.fullName || "Personal Trainer",
      email: trainerData.email || "",
      phone: trainerData.phone || "",
      location: trainerData.location || "",
      services: trainerData.services || ["Personal Training"],
      experience: trainerData.experience || "Professional Experience",
      certifications: trainerData.certifications || ["Certified Professional"],
      bio: trainerData.bio || "",
      specialties: trainerData.specialties || [],
      isActive: trainerData.isActive || false,
      isPaid: trainerData.isPaid || false,
      createdAt: trainerData.createdAt,
      expiresAt: trainerData.expiresAt,
      requestId: trainerData.requestId || "",
    }

    logger.info("API: Successfully returning trainer data", { tempId })

    return NextResponse.json(responseData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    logger.error("API: Error fetching trainer", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
