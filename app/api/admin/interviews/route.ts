import { type NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"
import matter from "gray-matter"

const INTERVIEW_CONTENT_PATH = "interviews/"

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

        interviews.push({
          title: frontmatter.title || "Untitled Interview",
          slug: rawSlug,
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

    console.log("[v0] PATCH /api/admin/interviews - Request body:", {
      slug,
      title,
      date,
      category,
      excerpt,
      image,
      trainerName,
    })

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
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      console.log("[v0] Comparing blob slug:", blobSlug, "with requested slug:", slug)
      return blobSlug === slug
    })

    if (!interviewBlob) {
      console.log("[v0] Interview not found for slug:", slug)
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log("[v0] Found interview blob:", interviewBlob.pathname)

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
    console.error("[v0] Error updating interview:", error)
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
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      console.log("[v0] Comparing blob slug:", blobSlug, "with requested slug:", slug)
      return blobSlug === slug
    })

    if (!interviewBlob) {
      console.log("[v0] Interview not found for slug:", slug)
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log("[v0] Found interview blob:", interviewBlob.pathname)

    // Delete the blob
    console.log("[v0] Deleting blob at url:", interviewBlob.url)
    await del(interviewBlob.url)

    console.log("[v0] Interview deleted successfully")
    return NextResponse.json({ success: true, message: "Interview deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting interview:", error)
    return NextResponse.json(
      { error: "Failed to delete interview", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
