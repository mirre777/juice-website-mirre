import { type NextRequest, NextResponse } from "next/server"
import { convertPotentialUserToTrainer } from "@/actions/status-management"

export async function POST(request: NextRequest) {
  console.log("🌐 CONVERT TO TRAINER API CALLED")
  console.log("🕐 Timestamp:", new Date().toISOString())

  try {
    const { userId } = await request.json()
    console.log("📊 User ID:", userId)

    if (!userId) {
      console.error("❌ User ID is required")
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      )
    }

    console.log("🔄 Calling convertPotentialUserToTrainer...")

    const result = await convertPotentialUserToTrainer(userId)

    console.log("📊 Conversion result:", {
      success: result.success,
      trainerId: result.trainerId,
      message: result.message,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        trainerId: result.trainerId,
        message: result.message,
        trainerData: result.trainerData,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("❌ Error in convert-to-trainer API:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
