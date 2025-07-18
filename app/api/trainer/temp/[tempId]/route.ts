import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { hasFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Trainer ID required" }, { status: 400 })
    }

    if (!hasFirebaseConfig()) {
      return NextResponse.json({ success: false, error: "Service temporarily unavailable" }, { status: 503 })
    }

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      return NextResponse.json({ success: false, error: "Trainer not found or expired" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)

    return NextResponse.json({ success: false, error: "Failed to load trainer" }, { status: 500 })
  }
}
