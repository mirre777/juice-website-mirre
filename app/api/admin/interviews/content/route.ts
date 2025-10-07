import { type NextRequest, NextResponse } from "next/server"
import { put, list } from "@vercel/blob"

const INTERVIEW_CONTENT_PATH = "interviews/"

// Function to clean slug from filename
function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/-\d{10,}/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

// GET - Fetch interview content for editing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    const interviewBlob = blobs.blobs.find((blob) => {
      const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      const blobSlug = cleanSlugFromFilename(rawSlug)
      const requestSlug = cleanSlugFromFilename(slug)
      // Match if either slug contains the other (handles partial slug matches)
      return blobSlug === requestSlug || blobSlug.includes(requestSlug) || requestSlug.includes(blobSlug)
    })

    if (!interviewBlob) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    const response = await fetch(interviewBlob.downloadUrl)
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

    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    console.log(`[v0] Total blobs found: ${blobs.blobs.length}`)

    blobs.blobs.forEach((blob, index) => {
      const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      const blobSlug = cleanSlugFromFilename(rawSlug)
      console.log(`[v0] Blob ${index + 1}:`)
      console.log(`[v0]   - pathname: ${blob.pathname}`)
      console.log(`[v0]   - rawSlug: ${rawSlug}`)
      console.log(`[v0]   - cleanedSlug: ${blobSlug}`)
    })

    const requestSlug = cleanSlugFromFilename(slug)
    console.log(`[v0] Request slug (original): ${slug}`)
    console.log(`[v0] Request slug (cleaned): ${requestSlug}`)

    const interviewBlob = blobs.blobs.find((blob) => {
      const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      const blobSlug = cleanSlugFromFilename(rawSlug)

      const exactMatch = blobSlug === requestSlug
      const blobContainsRequest = blobSlug.includes(requestSlug)
      const requestContainsBlob = requestSlug.includes(blobSlug)

      console.log(`[v0] Comparing "${blobSlug}" with "${requestSlug}":`)
      console.log(`[v0]   - exactMatch: ${exactMatch}`)
      console.log(`[v0]   - blobContainsRequest: ${blobContainsRequest}`)
      console.log(`[v0]   - requestContainsBlob: ${requestContainsBlob}`)

      return exactMatch || blobContainsRequest || requestContainsBlob
    })

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
