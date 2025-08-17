import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
// Function to slugify a string
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, "") // Remove leading and trailing dashes
}

function isSlugSimilar(slug1: string, slug2: string): boolean {
  if (Math.abs(slug1.length - slug2.length) > 2) return false

  let differences = 0
  const maxLength = Math.max(slug1.length, slug2.length)

  for (let i = 0; i < maxLength; i++) {
    if (slug1[i] !== slug2[i]) {
      differences++
      if (differences > 2) return false
    }
  }

  return differences <= 2 && differences > 0
}

// Additional code can be added here if necessary

export async function DELETE(req: NextRequest) {
  // Basic authentication: Check for a debug token
  const debugToken = req.headers.get("X-Debug-Token") || req.nextUrl.searchParams.get("debug_token")
  if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await req.json()

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 })
    }

    const { del, list } = await import("@vercel/blob")

    // Find and delete the markdown file
    const blobs = await list({ prefix: "blog/" })
    const deletedFiles = []

    for (const blob of blobs.blobs) {
      const filename = blob.pathname.replace("blog/", "")
      const fileSlug = filename.replace(/\.md$/, "").replace(/^-+/, "").replace(/-+$/, "")

      // Check for exact match or similar slugs (1-2 character differences)
      if (fileSlug === slug || isSlugSimilar(fileSlug, slug)) {
        await del(blob.url)
        deletedFiles.push(filename)
      }
    }

    // Also delete any associated image files
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    for (const blob of blobs.blobs) {
      const filename = blob.pathname.replace("blog/", "")
      const fileSlug = filename
        .replace(/\.[^.]+$/, "")
        .replace(/^-+/, "")
        .replace(/-+$/, "")

      if (
        (fileSlug === slug || isSlugSimilar(fileSlug, slug)) &&
        imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
      ) {
        await del(blob.url)
        deletedFiles.push(filename)
      }
    }

    // Revalidate the blog paths
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)

    return NextResponse.json(
      {
        message: `Successfully deleted blog post: ${slug}`,
        deletedFiles,
        slug,
      },
      { status: 200 },
    )
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
