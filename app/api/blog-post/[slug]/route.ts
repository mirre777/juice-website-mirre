import { del, list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  // Basic authentication: Check for a debug token
  const debugToken = request.headers.get("X-Debug-Token") || request.nextUrl.searchParams.get("debug_token")
  if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 })
    }

    console.log("[DELETE] Attempting to delete blog post with slug:", slug)

    // List all blobs in the blog directory
    const blobs = await list({ prefix: "blog/" })

    // Find the blob that matches this slug
    let foundBlob = null
    for (const blob of blobs.blobs) {
      const blobSlug = blob.pathname
        .replace("blog/", "")
        .replace(/\.md$/, "")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .toLowerCase()

      if (blobSlug === slug.toLowerCase()) {
        foundBlob = blob
        break
      }
    }

    if (!foundBlob) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    // Delete the blob
    await del(foundBlob.url)
    console.log("[DELETE] Successfully deleted blob:", foundBlob.pathname)

    // Revalidate the blog paths
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)

    return NextResponse.json({
      message: "Blog post deleted successfully",
      slug: slug,
      deletedFile: foundBlob.pathname,
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      {
        message: "Failed to delete blog post",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
