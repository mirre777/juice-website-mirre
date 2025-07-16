import { type NextRequest, NextResponse } from "next/server"
import { activateTrainer } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await request.json()

    console.log("[ACTIVATE] Manual trainer activation request:", { tempId, paymentIntentId })

    if (!tempId) {
      return NextResponse.json({ error: "Missing tempId" }, { status: 400 })
    }

    try {
      const result = await activateTrainer(tempId, {
        paymentIntentId,
        manualActivation: true,
        activatedAt: new Date().toISOString(),
      })

      console.log("[ACTIVATE] Trainer activated successfully:", result.finalId)

      return NextResponse.json({
        success: true,
        finalId: result.finalId,
        message: "Trainer activated successfully",
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
  } catch (error) {
    console.error("[ACTIVATE] Request parsing error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
