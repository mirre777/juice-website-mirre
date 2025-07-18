import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  console.log("GET /api/trainer/temp/[tempId] - Fetching temp trainer:", { tempId, hasToken: !!token })

  try {
    if (!tempId) {
      console.error("Missing trainer ID")
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    // Get the document from Firestore
    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.error("Temp trainer not found:", tempId)
      return NextResponse.json({ success: false, error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = docSnap.data()

    if (!trainerData) {
      console.error("Invalid trainer data for:", tempId)
      return NextResponse.json({ success: false, error: "Invalid trainer data" }, { status: 404 })
    }

    console.log("Trainer data found:", {
      tempId,
      name: trainerData.name,
      status: trainerData.status,
      hasExpiresAt: !!trainerData.expiresAt,
      hasSessionToken: !!trainerData.sessionToken,
    })

    // Check if token is required and valid
    if (token && trainerData.sessionToken !== token) {
      console.error("Invalid token provided:", { tempId, providedToken: token?.substring(0, 8) })
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    // Check if expired
    if (trainerData.expiresAt) {
      const expiresAt = new Date(trainerData.expiresAt)
      if (expiresAt < new Date()) {
        console.error("Temp trainer expired:", { tempId, expiresAt })
        return NextResponse.json({ success: false, error: "Trainer profile has expired" }, { status: 410 })
      }
    }

    // Convert Firestore timestamp to regular date if needed
    const trainer = {
      ...trainerData,
      id: docSnap.id,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || trainerData.createdAt,
    }

    console.log("Temp trainer fetched successfully:", {
      tempId,
      status: trainer.status,
      email: trainer.email,
    })

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", {
      tempId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json({ success: false, error: "Failed to fetch trainer profile" }, { status: 500 })
  }
}
