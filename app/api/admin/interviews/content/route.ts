import { type NextRequest, NextResponse } from "next/server"
import { put, list } from "@vercel/blob"

const INTERVIEW_CONTENT_PATH = "interviews/"

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
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      return blobSlug === slug
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

    if (!slug || !content) {
      return NextResponse.json({ error: "Slug and content are required" }, { status: 400 })
    }

    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })
    const interviewBlob = blobs.blobs.find((blob) => {
      const blobSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
      return blobSlug === slug
    })

    if (!interviewBlob) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // Upload updated content
    await put(interviewBlob.pathname, content, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true, message: "Interview content updated successfully" })
  } catch (error) {
    console.error("Error updating interview content:", error)
    return NextResponse.json({ error: "Failed to update interview content" }, { status: 500 })
  }
}
