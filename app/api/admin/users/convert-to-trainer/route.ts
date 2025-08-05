import { type NextRequest, NextResponse } from "next/server"
import { convertPotentialUserToTrainer } from "../../../../actions/status-management"

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

    console.log("🔄 Converting potential user to trainer...")

    const result = await convertPotentialUserToTrainer(userId)

    if (!result.success) {
      console.error("❌ Conversion failed:", result.message)
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 },
      )
    }

    console.log("✅ Trainer created successfully:", result.trainerId)

    return NextResponse.json({
      success: true,
      message: result.message,
      trainerId: result.trainerId,
      trainerData: result.trainerData,
    })
  } catch (error) {
    console.error("❌ Error converting to trainer:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to convert to trainer",
      },
      { status: 500 },
    )
  }
}
