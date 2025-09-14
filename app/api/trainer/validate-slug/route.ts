import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, trainerId } = body

    if (!slug) {
      return NextResponse.json({
        isValid: false,
        isAvailable: false,
        error: "Slug is required",
      })
    }

    const validation = await TrainerService.validateCustomSlug(slug, trainerId)

    return NextResponse.json(validation)
  } catch (error) {
    console.error("Error validating slug:", error)
    return NextResponse.json({
      isValid: false,
      isAvailable: false,
      error: "Failed to validate slug",
    })
  }
}
