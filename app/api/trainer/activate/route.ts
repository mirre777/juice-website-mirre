import { type NextRequest, NextResponse } from "next/server"
import { activateTrainer } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { tempId, paymentData } = await request.json()

    console.log("[TRAINER ACTIVATE] Activating trainer:", tempId)

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    try {
      const result = await activateTrainer(tempId, paymentData)

      console.log("[TRAINER ACTIVATE] Trainer activated successfully:", result.finalId)

      return NextResponse.json({
        success: true,
        finalId: result.finalId,
        message: "Trainer activated successfully",
      })
    } catch (firebaseError) {
      console.error("[TRAINER ACTIVATE] Firebase error:", firebaseError)
      return NextResponse.json({ error: "Failed to activate trainer" }, { status: 500 })
    }
  } catch (error) {
    console.error("[TRAINER ACTIVATE] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
