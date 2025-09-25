import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog"
import { del, list, put } from "@vercel/blob" // Added put import for updating blog posts

function isHardcodedPost(slug: string): boolean {
  const hardcodedSlugs = [
    "fundamentals-of-weightlifting-guide-to-building-real-strength",
    "are-wearables-accurate-enough-to-track-complex-lifting-movements",
    "tracking-biometrics-what-actually-moves-the-needle",
    "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
    "how-to-get-more-clients-with-booking-page",
    "top-5-free-personal-trainer-website-builders-2025",
    "seo-tips-for-fitness-coaches-in-europe",
    "strength-training-revolution-berlin-gyms",
  ]

  return hardcodedSlugs.includes(slug)
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Blog admin API: Fetching all posts...")

    // Get all posts using the existing blog system
    const allPosts = await getAllPosts()
    console.log(`[v0] Blog admin API: Retrieved ${allPosts.length} total posts`)

    const errors = (getAllPosts as any).lastErrors || []

    const postsWithSource = allPosts.map((post) => ({
      ...post,
      source: isHardcodedPost(post.slug) ? "hardcoded" : "blob",
    }))

    const hardcodedPosts = postsWithSource.filter((post) => post.source === "hardcoded")
    const blobPosts = postsWithSource.filter((post) => post.source === "blob")

    console.log(`[v0] Blog admin API: ${hardcodedPosts.length} hardcoded, ${blobPosts.length} blob posts`)

    const response = {
      totalPosts: allPosts.length,
      hardcodedPosts: hardcodedPosts.length,
      blobPosts: blobPosts.length,
      posts: postsWithSource,
      errors: errors,
      isWorkingCorrectly: allPosts.length > 0 && errors.length === 0,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Blog admin API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { slug, image } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Prevent updating hardcoded posts
    if (isHardcodedPost(slug)) {
      return NextResponse.json({ error: "Cannot update hardcoded sample posts" }, { status: 403 })
    }

    console.log(`[v0] Blog admin API: Updating image for post with slug: ${slug}`)

    // Find the existing blog post file with improved matching
    const { blobs } = await list({ prefix: "blog/" })

    const blogFile = blobs.find((blob) => {
      if (!blob.pathname.endsWith(".md")) return false

      const rawSlug = blob.pathname.replace("blog/", "").replace(/\.md$/, "")
      const cleanedSlug = cleanSlugFromFilename(rawSlug)

      // Try multiple matching strategies
      return (
        cleanedSlug === slug || // Exact match after cleaning
        rawSlug === slug || // Exact raw match
        blob.pathname.includes(slug) || // Contains slug
        rawSlug.includes(slug) || // Raw slug contains target
        slug.includes(cleanedSlug) || // Target contains cleaned slug
        slug.includes(rawSlug) // Target contains raw slug
      )
    })

    if (!blogFile) {
      console.log(`[v0] Blog admin API: No matching file found for slug: ${slug}`)
      console.log(
        `[v0] Available files:`,
        blobs.map((b) => b.pathname),
      )
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    console.log(`[v0] Blog admin API: Found matching file: ${blogFile.pathname}`)

    // Fetch the current content
    const response = await fetch(blogFile.url)
    const currentContent = await response.text()

    // Update the frontmatter image field
    const updatedContent = updateFrontmatterImage(currentContent, image)

    // Upload the updated content back to blob storage
    await put(blogFile.pathname, updatedContent, {
      access: "public",
      allowOverwrite: true,
    })

    console.log(`[v0] Blog admin API: Successfully updated image for post: ${slug}`)

    // Revalidate cache
    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath("/blog")
      revalidatePath(`/blog/${slug}`)
      console.log("[v0] Blog admin API: Cache revalidated for updated post")
    } catch (revalidateError) {
      console.error("[v0] Blog admin API: Failed to revalidate cache:", revalidateError)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated image for post: ${slug}`,
    })
  } catch (error) {
    console.error("[v0] Blog admin API patch error:", error)
    return NextResponse.json(
      {
        error: "Failed to update blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Prevent deletion of hardcoded posts
    if (isHardcodedPost(slug)) {
      return NextResponse.json({ error: "Cannot delete hardcoded sample posts" }, { status: 403 })
    }

    console.log(`[v0] Blog admin API: Deleting post with slug: ${slug}`)

    // List all blob files to find files related to this slug
    const { blobs } = await list({ prefix: "blog/" })
    const filesToDelete = blobs.filter((blob) => blob.pathname.includes(slug))

    console.log(`[v0] Blog admin API: Found ${filesToDelete.length} files to delete for slug: ${slug}`)

    // Delete all related files (markdown content and images)
    const deletePromises = filesToDelete.map((blob) => {
      console.log(`[v0] Blog admin API: Deleting file: ${blob.pathname}`)
      return del(blob.url)
    })

    await Promise.all(deletePromises)

    console.log(`[v0] Blog admin API: Successfully deleted ${filesToDelete.length} files for post: ${slug}`)

    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath("/blog")
      revalidatePath("/blog/[slug]", "page")
      console.log("[v0] Blog admin API: Cache revalidated for /blog and /blog/[slug]")
    } catch (revalidateError) {
      console.error("[v0] Blog admin API: Failed to revalidate cache:", revalidateError)
      // Don't fail the deletion if revalidation fails
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted post: ${slug}`,
      deletedFiles: filesToDelete.length,
    })
  } catch (error) {
    console.error("[v0] Blog admin API delete error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function updateFrontmatterImage(content: string, newImageUrl: string): string {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) {
    // If no frontmatter exists, add it
    return `---\nimage: "${newImageUrl}"\n---\n\n${content}`
  }

  const frontmatter = match[1]
  const restOfContent = content.substring(match[0].length)

  // Check if image field already exists
  const imageRegex = /^image:\s*"?([^"\n]*)"?$/m

  let updatedFrontmatter: string
  if (imageRegex.test(frontmatter)) {
    // Replace existing image
    updatedFrontmatter = frontmatter.replace(imageRegex, `image: "${newImageUrl}"`)
  } else {
    // Add new image field
    updatedFrontmatter = frontmatter + `\nimage: "${newImageUrl}"`
  }

  return `---\n${updatedFrontmatter}\n---${restOfContent}`
}

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
