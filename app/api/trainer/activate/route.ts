import { type NextRequest, NextResponse } from "next/server"
import { activateTrainer, getTrainerById } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { trainerId } = await request.json()

    console.log("[ACTIVATE] === TRAINER ACTIVATION DEBUG ===")
    console.log("[ACTIVATE] 1. Activating trainer:", trainerId)

    if (!trainerId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    // Check if trainer exists
    const trainer = await getTrainerById(trainerId)
    if (!trainer) {
      console.log("[ACTIVATE] 2. Trainer not found:", trainerId)
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    // Activate the trainer
    await activateTrainer(trainerId)
    console.log("[ACTIVATE] 3. Trainer activated successfully:", trainerId)

    return NextResponse.json({
      success: true,
      message: "Trainer activated successfully",
      trainerId,
    })
  } catch (error) {
    console.error("[ACTIVATE] 4. Error activating trainer:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to activate trainer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
