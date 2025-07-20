import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    console.log("=== TEMP TRAINER API ENDPOINT ===")
    console.log("Temp ID:", tempId)

    if (!tempId) {
      console.log("❌ No temp ID provided")
      return NextResponse.json(
        {
          success: false,
          error: "Temp ID is required",
        },
        { status: 400 },
      )
    }

    const trainer = await TrainerService.getTempTrainer(tempId)

    console.log("Trainer from service:", trainer)

    if (!trainer) {
      console.log("❌ Trainer not found or expired")
      return NextResponse.json(
        {
          success: false,
          error: "Trainer not found or expired",
        },
        { status: 404 },
      )
    }

    console.log("✅ Trainer found, returning success response")
    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("❌ Error fetching temp trainer:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
