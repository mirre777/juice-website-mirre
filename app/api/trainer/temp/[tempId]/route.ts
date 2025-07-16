import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  try {
    logger.info("Fetching temp trainer", { tempId, hasToken: !!token })

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    // Get the document from Firestore
    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      logger.warn("Temp trainer not found", { tempId })
      return NextResponse.json({ success: false, error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = docSnap.data()

    if (!trainerData) {
      return NextResponse.json({ success: false, error: "Invalid trainer data" }, { status: 404 })
    }

    // Check if token is required and valid
    if (token && trainerData.sessionToken !== token) {
      logger.warn("Invalid token", { tempId, providedToken: token?.substring(0, 8) })
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    // Check if expired
    const expiresAt = new Date(trainerData.expiresAt)
    if (expiresAt < new Date()) {
      logger.warn("Temp trainer expired", { tempId, expiresAt })
      return NextResponse.json({ success: false, error: "Trainer profile has expired" }, { status: 410 })
    }

    // Convert Firestore timestamp to regular date if needed
    const trainer = {
      ...trainerData,
      id: docSnap.id,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || trainerData.createdAt,
    }

    logger.info("Temp trainer fetched successfully", {
      tempId,
      status: trainer.status,
      email: trainer.email,
    })

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    logger.error("Error fetching temp trainer", {
      tempId,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ success: false, error: "Failed to fetch trainer profile" }, { status: 500 })
  }
}
