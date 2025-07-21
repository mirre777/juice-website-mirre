import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

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
