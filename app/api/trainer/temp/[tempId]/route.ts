import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    console.log("Fetching temp trainer with ID:", params.tempId)

    if (!db) {
      console.error("Database not initialized")
      return NextResponse.json({ success: false, error: "Database not available" }, { status: 500 })
    }

    const doc = await db.collection("trainers").doc(params.tempId).get()

    if (!doc.exists) {
      console.log("Trainer not found:", params.tempId)
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = { id: doc.id, ...doc.data() }
    console.log("Trainer data fetched successfully:", trainerData.id)

    return NextResponse.json({
      success: true,
      trainer: trainerData,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trainer data" }, { status: 500 })
  }
}
