import { list, del } from "@vercel/blob"

console.log("[v0] Starting removal of man-squatting blog post...")

try {
  // List all blog posts
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} blog posts in storage`)

  // Find posts matching the man-squatting pattern
  const postsToDelete = blobs.filter((blob) => {
    const filename = blob.pathname.toLowerCase()
    return filename.includes("man-squatting") || filename.includes("barbell") || filename.includes("wearable-bracelet")
  })

  console.log(`[v0] Found ${postsToDelete.length} posts to delete:`)
  postsToDelete.forEach((post) => {
    console.log(`[v0] - ${post.pathname}`)
  })

  // Delete the posts
  for (const post of postsToDelete) {
    await del(post.url)
    console.log(`[v0] Deleted: ${post.pathname}`)
  }

  console.log(`[v0] Successfully deleted ${postsToDelete.length} blog posts`)

  // Show remaining posts
  const { blobs: remainingBlobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Remaining blog posts: ${remainingBlobs.length}`)
  remainingBlobs.forEach((blob) => {
    const filename = blob.pathname.replace("blog/", "").replace(".md", "")
    console.log(`[v0] - ${filename}`)
  })
} catch (error) {
  console.error("[v0] Error removing blog posts:", error)
}
