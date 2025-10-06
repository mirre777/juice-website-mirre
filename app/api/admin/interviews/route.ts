import { type NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"
import matter from "gray-matter"

const INTERVIEW_CONTENT_PATH = "interviews/"

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

// GET - Fetch all interviews
export async function GET() {
  try {
    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    const interviews = []

    for (const blob of blobs.blobs) {
      try {
        const response = await fetch(blob.downloadUrl)
        const content = await response.text()
        const { data: frontmatter } = matter(content)

        const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
        const slug = cleanSlugFromFilename(rawSlug)

        interviews.push({
          title: frontmatter.title || "Untitled Interview",
          slug: slug,
          date: frontmatter.date || new Date().toISOString().split("T")[0],
          category: "Interview",
          excerpt: frontmatter.excerpt || "",
          image: frontmatter.image || "",
          trainerName: frontmatter.trainerName || "",
          source: "blob",
        })
      } catch (error) {
        console.error(`Error processing interview blob ${blob.pathname}:`, error)
      }
    }

    return NextResponse.json({
      totalInterviews: interviews.length,
      interviews: interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    })
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

// PATCH - Update interview metadata
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, date, category, excerpt, image, trainerName } = body

    console.log("[v0] ===== PATCH /api/admin/interviews =====")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Find the interview blob
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

    // Fetch current content
    const response = await fetch(interviewBlob.downloadUrl)
    const currentContent = await response.text()
    const { data: frontmatter, content: markdownContent } = matter(currentContent)

    // Update frontmatter with new values
    const updatedFrontmatter = {
      ...frontmatter,
      ...(title && { title }),
      ...(date && { date }),
      ...(category && { category }),
      ...(excerpt && { excerpt }),
      ...(image !== undefined && { image }),
      ...(trainerName && { trainerName }),
    }

    console.log("[v0] Updated frontmatter:", updatedFrontmatter)

    // Reconstruct the markdown file
    const updatedContent = matter.stringify(markdownContent, updatedFrontmatter)

    // Upload updated content
    console.log("[v0] Uploading to pathname:", interviewBlob.pathname)
    await put(interviewBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("[v0] Interview updated successfully")
    return NextResponse.json({ success: true, message: "Interview updated successfully" })
  } catch (error) {
    console.error("[v0] ❌ Error updating interview:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Failed to update interview", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// DELETE - Delete interview
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Find the interview blob
    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    console.log(
      "[v0] Found blobs:",
      blobs.blobs.map((b) => b.pathname),
    )

    const interviewBlob = blobs.blobs.find((blob) => {
      const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      const blobSlug = cleanSlugFromFilename(rawSlug)
      const requestSlug = cleanSlugFromFilename(slug)
      console.log("[v0] Comparing blob slug:", blobSlug, "with requested slug:", requestSlug)
      // Match if either slug contains the other (handles partial slug matches)
      return blobSlug === requestSlug || blobSlug.includes(requestSlug) || requestSlug.includes(blobSlug)
    })

    if (!interviewBlob) {
      console.log("[v0] ❌ Interview not found for slug:", slug)
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log("[v0] ✅ Found interview blob:", interviewBlob.pathname)

    // Delete the blob
    console.log("[v0] Deleting blob at url:", interviewBlob.url)
    await del(interviewBlob.url)

    console.log("[v0] Interview deleted successfully")
    return NextResponse.json({ success: true, message: "Interview deleted successfully" })
  } catch (error) {
    console.error("[v0] ❌ Error deleting interview:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Failed to delete interview", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
