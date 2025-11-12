import { type NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"
import matter from "gray-matter"
import { renameSlug, findBlobBySlug, cleanSlugFromFilename } from "@/app/admin/blog/utils/blog-and-interview-helpers"

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
    const { slug, title, date, category, excerpt, image, trainerName, newSlug } = body

    // Handle slug rename separately (different operation)
    if (newSlug) {
      const { revalidatePath } = await import("next/cache")
      const result = await renameSlug(slug, newSlug, INTERVIEW_CONTENT_PATH, revalidatePath)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: `Successfully renamed slug from "${slug}" to "${result.newSlug}"`,
        newSlug: result.newSlug,
      })
    }

    console.log("[v0] ===== PATCH /api/admin/interviews =====")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))
    console.log("[v0] Image field received:", image)
    console.log("[v0] Image field type:", typeof image)
    console.log("[v0] Image !== undefined:", image !== undefined)

    // Find the interview blob
    const interviewBlob = await findBlobBySlug(slug, INTERVIEW_CONTENT_PATH)

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
    console.log("[v0] Old image:", frontmatter.image)
    console.log("[v0] New image:", updatedFrontmatter.image)

    // Reconstruct the markdown file
    const updatedContent = matter.stringify(markdownContent, updatedFrontmatter)

    // Upload updated content
    console.log("[v0] Uploading to pathname:", interviewBlob.pathname)
    await put(interviewBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/markdown",
      allowOverwrite: true,
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
    const interviewBlob = await findBlobBySlug(slug, INTERVIEW_CONTENT_PATH)

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

