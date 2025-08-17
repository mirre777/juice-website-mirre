import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog"
import { del, list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Blog admin API: Fetching all posts...")

    // Get all posts using the existing blog system
    const allPosts = await getAllPosts()
    console.log(`[v0] Blog admin API: Retrieved ${allPosts.length} total posts`)

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
      isWorkingCorrectly: allPosts.length > 0,
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
