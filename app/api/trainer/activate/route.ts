import { type NextRequest, NextResponse } from "next/server"
import { activateTrainer } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { tempId, paymentData } = await request.json()

    console.log("[ACTIVATE] Activating trainer:", tempId)

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    const result = await activateTrainer(tempId, paymentData)

    console.log("[ACTIVATE] Trainer activated successfully:", result.finalId)

    return NextResponse.json({
      success: true,
      finalId: result.finalId,
      trainer: result.trainerData,
    })
  } catch (error) {
    console.error("[ACTIVATE] Error activating trainer:", error)
    return NextResponse.json(
      {
        error: "Failed to activate trainer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
