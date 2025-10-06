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

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Find the interview blob
    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    const interviewBlob = blobs.blobs.find((blob) => {
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      return blobSlug === slug
    })

    if (!interviewBlob) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

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

    // Reconstruct the markdown file
    const updatedContent = matter.stringify(markdownContent, updatedFrontmatter)

    // Upload updated content
    await put(interviewBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true, message: "Interview updated successfully" })
  } catch (error) {
    console.error("Error updating interview:", error)
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
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
    const interviewBlob = blobs.blobs.find((blob) => {
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      return blobSlug === slug
    })

    if (!interviewBlob) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // Delete the blob
    await del(interviewBlob.url)

    return NextResponse.json({ success: true, message: "Interview deleted successfully" })
  } catch (error) {
    console.error("Error deleting interview:", error)
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 })
  }
}
