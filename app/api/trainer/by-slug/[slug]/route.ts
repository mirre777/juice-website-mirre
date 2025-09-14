import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug parameter is required" }, { status: 400 })
    }

    // Try to find trainer by custom slug first
    let trainer = await TrainerService.getTrainerByCustomSlug(slug)
    let shouldRedirect = false
    let canonicalUrl = null

    // If not found by custom slug, try by ID (fallback for backwards compatibility)
    if (!trainer) {
      try {
        trainer = await TrainerService.getTempTrainer(slug)

        // If trainer has a custom slug, we should redirect to it for SEO
        if (trainer?.settings?.customSlug) {
          shouldRedirect = true
          canonicalUrl = `/marketplace/trainer/${trainer.settings.customSlug}`
        }
      } catch (error) {
        // If getTempTrainer fails, the trainer doesn't exist
        return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
      }
    }

    if (!trainer) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    // Check if trainer is active
    if (trainer.status !== "active" && trainer.status !== "temp") {
      return NextResponse.json({ success: false, error: "Trainer profile is not available" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      trainer,
      content: trainer.content,
      shouldRedirect,
      canonicalUrl,
    })
  } catch (error) {
    console.error("Error fetching trainer by slug:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
