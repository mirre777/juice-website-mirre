import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    console.log("Fetching temp trainer:", tempId)

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      console.log("Temp trainer not found:", tempId)
      return NextResponse.json({ error: "Trainer not found or expired" }, { status: 404 })
    }

    console.log("Found temp trainer:", trainer.fullName)

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: "Failed to fetch trainer data" }, { status: 500 })
  }
}
