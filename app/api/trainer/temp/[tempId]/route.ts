import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    logger.info("Temp trainer API called", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    })

    if (!tempId) {
      logger.warn("No tempId provided", {
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer ID is required",
        },
        { status: 400 },
      )
    }

    if (!token) {
      logger.warn("Temp trainer access denied - no token", {
        tempId,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Access token required",
        },
        { status: 401 },
      )
    }

    // Check if Firebase is initialized
    if (!db) {
      logger.error("Firebase not initialized", {
        tempId,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Database connection error",
        },
        { status: 500 },
      )
    }

    logger.info("Attempting to fetch trainer document", {
      tempId,
      timestamp: new Date().toISOString(),
    })

    // Get trainer document
    const trainerRef = doc(db, "trainers", tempId)
    const trainerSnap = await getDoc(trainerRef)

    logger.info("Firestore query completed", {
      tempId,
      exists: trainerSnap.exists(),
      timestamp: new Date().toISOString(),
    })

    if (!trainerSnap.exists()) {
      logger.warn("Temp trainer not found", {
        tempId,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Trainer profile not found",
        },
        { status: 404 },
      )
    }

    const trainerData = trainerSnap.data()

    logger.info("Trainer data retrieved", {
      tempId,
      hasSessionToken: !!trainerData.sessionToken,
      hasExpiresAt: !!trainerData.expiresAt,
      email: trainerData.email,
      timestamp: new Date().toISOString(),
    })

    // Validate session token
    if (trainerData.sessionToken !== token) {
      logger.warn("Invalid session token", {
        tempId,
        providedToken: token?.substring(0, 8) + "...",
        storedToken: trainerData.sessionToken?.substring(0, 8) + "...",
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid session token",
        },
        { status: 401 },
      )
    }

    // Check if session has expired
    const now = new Date()
    const expiresAt = trainerData.expiresAt?.toDate()

    if (!expiresAt) {
      logger.error("No expiration date found", {
        tempId,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid session data",
        },
        { status: 500 },
      )
    }

    if (now > expiresAt) {
      logger.warn("Session expired", {
        tempId,
        expiresAt: expiresAt.toISOString(),
        currentTime: now.toISOString(),
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: "Session has expired",
          expired: true,
        },
        { status: 410 },
      )
    }

    // Check if already activated
    if (trainerData.isActive && trainerData.isPaid) {
      logger.info("Trainer already activated, redirecting", {
        tempId,
        finalId: trainerData.finalId,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json({
        success: true,
        isActivated: true,
        finalId: trainerData.finalId,
        redirectUrl: `/marketplace/trainer/${trainerData.finalId}`,
      })
    }

    logger.info("Valid temp trainer session", {
      tempId,
      email: trainerData.email,
      specialty: trainerData.specialty,
      expiresAt: expiresAt.toISOString(),
      timeRemaining: Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)) + " hours",
    })

    // Return trainer data (excluding sensitive fields)
    const { sessionToken, ...publicData } = trainerData

    const responseData = {
      success: true,
      trainer: {
        ...publicData,
        id: tempId,
        expiresAt: expiresAt.toISOString(),
        timeRemaining: expiresAt.getTime() - now.getTime(),
      },
    }

    logger.info("Returning trainer data", {
      tempId,
      hasTrainerData: !!responseData.trainer,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    logger.error("Temp trainer API error", {
      tempId: params?.tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
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
