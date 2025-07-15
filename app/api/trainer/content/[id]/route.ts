import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id

    if (!trainerId) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log("Fetching trainer content for:", trainerId)

    // Get trainer document from Firestore
    const trainerRef = doc(db, "trainers", trainerId)
    const trainerDoc = await getDoc(trainerRef)

    if (!trainerDoc.exists()) {
      console.log("Trainer not found:", trainerId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()
    console.log("Trainer data retrieved:", {
      id: trainerId,
      status: trainerData.status,
      isActive: trainerData.isActive,
      hasContent: !!trainerData.content,
    })

    // Check if trainer is active and has content
    if (trainerData.status !== "active" || !trainerData.isActive) {
      return NextResponse.json(
        {
          error: "Trainer not activated",
          status: trainerData.status,
          isActive: trainerData.isActive,
        },
        { status: 403 },
      )
    }

    // Return the trainer content
    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerId,
        ...trainerData,
      },
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}
