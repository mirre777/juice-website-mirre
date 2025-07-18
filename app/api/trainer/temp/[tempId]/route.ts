import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  try {
    console.log("=== TEMP TRAINER API DEBUG ===")
    console.log("1. Received tempId:", tempId)
    console.log("2. Has token:", !!token)
    console.log("3. DB initialized:", !!db)

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    if (!db) {
      console.error("4. Firebase not initialized")
      return NextResponse.json({ success: false, error: "Database not available" }, { status: 500 })
    }

    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.log("5. Trainer not found in Firebase:", tempId)
      return NextResponse.json({ success: false, error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = docSnap.data()

    if (!trainerData) {
      return NextResponse.json({ success: false, error: "Invalid trainer data" }, { status: 404 })
    }

    console.log("6. Found trainer:", {
      name: trainerData.name || trainerData.fullName,
      status: trainerData.status,
      hasExpiresAt: !!trainerData.expiresAt,
    })

    if (token && trainerData.sessionToken !== token) {
      console.log("7. Invalid token provided")
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    if (trainerData.expiresAt) {
      const expiresAt = new Date(trainerData.expiresAt)
      if (expiresAt < new Date()) {
        console.log("8. Trainer expired")
        return NextResponse.json({ success: false, error: "Trainer profile has expired" }, { status: 410 })
      }
    }

    const trainer = {
      ...trainerData,
      id: docSnap.id,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || trainerData.createdAt,
    }

    console.log("9. Returning trainer data successfully")

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
