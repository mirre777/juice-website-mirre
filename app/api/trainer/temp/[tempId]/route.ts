import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found or expired" }, { status: 404 })
    }

    return NextResponse.json({ trainer })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
