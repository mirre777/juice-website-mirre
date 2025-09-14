import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trainerId, customSlug } = body

    if (!trainerId || !customSlug) {
      return NextResponse.json({
        success: false,
        error: "Trainer ID and custom slug are required",
      })
    }

    const result = await TrainerService.updateCustomSlug(trainerId, customSlug)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating custom slug:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to update custom slug",
    })
  }
}
