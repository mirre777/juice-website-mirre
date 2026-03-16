import { list, del } from "@vercel/blob"

console.log("[v0] Starting removal of corrupted blog post...")

try {
  // List all blog posts
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} blog posts in storage`)

  // Look for posts with corrupted titles or content
  const corruptedPosts = []

  for (const blob of blobs) {
    try {
      const response = await fetch(blob.url)
      const content = await response.text()

      // Check for corrupted content patterns
      if (
        content.includes("WO\\") ||
        content.includes("���") ||
        content.includes("XI:9���m��G��&K��") ||
        content.includes("Z���") ||
        blob.pathname.includes("2025-08-23")
      ) {
        corruptedPosts.push(blob)
        console.log(`[v0] Found corrupted post: ${blob.pathname}`)
      }
    } catch (error) {
      console.log(`[v0] Error reading ${blob.pathname}:`, error.message)
    }
  }

  // Remove corrupted posts
  for (const post of corruptedPosts) {
    await del(post.url)
    console.log(`[v0] Deleted corrupted post: ${post.pathname}`)
  }

  console.log(`[v0] Successfully removed ${corruptedPosts.length} corrupted blog posts`)

  // List remaining posts
  const { blobs: remainingBlobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Remaining blog posts: ${remainingBlobs.length}`)

  remainingBlobs.forEach((blob) => {
    console.log(`[v0] - ${blob.pathname}`)
  })
} catch (error) {
  console.error("[v0] Error removing corrupted blog post:", error)
}
