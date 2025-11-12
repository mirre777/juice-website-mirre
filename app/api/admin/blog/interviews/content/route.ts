import { type NextRequest, NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import { findBlobBySlug, cleanSlugFromFilename } from "@/app/admin/blog/utils/blog-and-interview-helpers"

const INTERVIEW_CONTENT_PATH = "interviews/"

// GET - Fetch interview content for editing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const interviewBlob = await findBlobBySlug(slug, INTERVIEW_CONTENT_PATH)

    if (!interviewBlob) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    const response = await fetch(`${interviewBlob.downloadUrl}?t=${Date.now()}`, { cache: "no-store" })
    const content = await response.text()

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error fetching interview content:", error)
    return NextResponse.json({ error: "Failed to fetch interview content" }, { status: 500 })
  }
}

// PATCH - Update interview content
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, content } = body

    console.log("[v0] ===== PATCH /api/admin/interviews/content =====")
    console.log("[v0] Request slug:", slug)
    console.log("[v0] Content length:", content?.length)

    if (!slug || !content) {
      return NextResponse.json({ error: "Slug and content are required" }, { status: 400 })
    }

    const interviewBlob = await findBlobBySlug(slug, INTERVIEW_CONTENT_PATH)

    if (!interviewBlob) {
      console.log("[v0] ❌ Interview not found for slug:", slug)
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log("[v0] ✅ Found interview blob:", interviewBlob.pathname)

    // Upload updated content
    console.log("[v0] Uploading to pathname:", interviewBlob.pathname)
    await put(interviewBlob.pathname, content, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/markdown",
      allowOverwrite: true,
    })

    console.log("[v0] Interview content updated successfully")
    return NextResponse.json({ success: true, message: "Interview content updated successfully" })
  } catch (error) {
    console.error("[v0] ❌ Error updating interview content:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Failed to update interview content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

