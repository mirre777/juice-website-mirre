import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { db } from "@/firebase"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    console.log("=== TEMP TRAINER API ENDPOINT ===")
    console.log("Temp ID:", tempId)

    if (!tempId) {
      console.log("❌ No temp ID provided")
      return NextResponse.json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    const trainer = await TrainerService.getTempTrainer(tempId)

    console.log("=== TRAINER SERVICE RESULT ===")
    console.log("Trainer found:", !!trainer)
    console.log("Trainer data:", trainer)

    if (!trainer) {
      console.log("❌ Trainer not found or expired")
      return NextResponse.json({ success: false, error: "Trainer not found or expired" }, { status: 404 })
    }

    console.log("✅ Returning trainer data with success: true")
    return NextResponse.json({ success: true, trainer })
  } catch (error) {
    console.error("❌ Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { content } = await request.json()

    console.log("=== TEMP TRAINER PUT ENDPOINT ===")
    console.log("Temp ID:", tempId)
    console.log("Content update:", content)

    if (!tempId) {
      console.log("❌ No temp ID provided")
      return NextResponse.json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    if (!content) {
      console.log("❌ No content provided")
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
    }

    // Get current trainer to check status
    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      console.log("❌ Trainer not found")
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    // Check if trainer is already activated
    if (trainer.status === "active" && trainer.isPaid) {
      console.log("❌ Trainer already activated, should use live endpoint")
      return NextResponse.json(
        {
          success: false,
          error: "Trainer already activated",
          redirectTo: `/marketplace/trainer/${trainer.id}`,
        },
        { status: 400 },
      )
    }

    // Update temp trainer content
    await db.collection("trainers").doc(tempId).update({
      content: content,
      updatedAt: new Date().toISOString(),
    })

    console.log("✅ Temp trainer content updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error updating temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to update trainer content" }, { status: 500 })
  }
}
