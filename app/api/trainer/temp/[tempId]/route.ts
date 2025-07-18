import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("=== TEMP TRAINER API DEBUG ===")
    console.log("1. Received tempId:", tempId)
    console.log("2. Has token:", !!token)
    console.log("3. Database available:", !!db)

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    if (!db) {
      console.error("Database not initialized")
      return NextResponse.json({ success: false, error: "Database not available" }, { status: 500 })
    }

    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.log("4. Trainer not found in Firebase:", tempId)
      return NextResponse.json({ success: false, error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = docSnap.data()

    if (!trainerData) {
      return NextResponse.json({ success: false, error: "Invalid trainer data" }, { status: 404 })
    }

    console.log("5. Found trainer:", {
      fullName: trainerData.fullName,
      status: trainerData.status,
      hasContent: !!trainerData.content,
    })

    // Validate token if provided
    if (token && trainerData.sessionToken !== token) {
      console.log("6. Invalid token provided")
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    // Check expiration
    if (trainerData.expiresAt) {
      const expiresAt = new Date(trainerData.expiresAt)
      if (expiresAt < new Date()) {
        console.log("7. Trainer expired")
        return NextResponse.json({ success: false, error: "Trainer profile has expired" }, { status: 410 })
      }
    }

    const trainer = {
      ...trainerData,
      id: docSnap.id,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || trainerData.createdAt,
      updatedAt: trainerData.updatedAt?.toDate?.()?.toISOString() || trainerData.updatedAt,
    }

    console.log("8. Returning trainer data successfully")

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trainer profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
