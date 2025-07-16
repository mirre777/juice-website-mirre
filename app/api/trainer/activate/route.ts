import { type NextRequest, NextResponse } from "next/server"
import { activateTrainer } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await request.json()

    console.log("[ACTIVATE] Activating trainer:", { tempId, paymentIntentId })

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    try {
      const activatedTrainer = await activateTrainer(tempId, paymentIntentId)

      return NextResponse.json({
        success: true,
        trainer: activatedTrainer,
      })
    } catch (firebaseError) {
      console.error("[ACTIVATE] Firebase error:", firebaseError)
      return NextResponse.json({ error: "Failed to activate trainer" }, { status: 500 })
    }
  } catch (error) {
    console.error("[ACTIVATE] Error activating trainer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
