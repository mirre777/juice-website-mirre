import { list, del } from "@vercel/blob"

console.log("[v0] Starting direct blog post removal...")

// Specific posts to remove
const postsToRemove = ["training-smarter-with-rpe", "u09dhcytykc-has-joined-the-channel-1756999522807"]

try {
  // List all blog files
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} total blog files`)

  let deletedCount = 0

  for (const blob of blobs) {
    const fileName = blob.pathname.replace("blog/", "").replace(/\.(md|json)$/, "")

    // Check if this file matches any post to remove
    const shouldRemove = postsToRemove.some((postSlug) => fileName.includes(postSlug) || postSlug.includes(fileName))

    if (shouldRemove) {
      console.log(`[v0] Deleting: ${blob.pathname}`)
      await del(blob.url)
      deletedCount++
    }
  }

  console.log(`[v0] Successfully deleted ${deletedCount} blog posts`)

  // Show remaining posts
  const { blobs: remaining } = await list({ prefix: "blog/" })
  console.log(`[v0] Remaining posts: ${remaining.length}`)
} catch (error) {
  console.error("[v0] Error:", error)
}
