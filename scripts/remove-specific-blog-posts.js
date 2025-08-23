import { list, del } from "@vercel/blob"

console.log("[v0] Starting blog post removal script...")

// Posts to remove (with various URL formats)
const postsToRemove = [
  "weightlifting-also-known-as-strength-or-resistanc-1755457007047-png",
  "weightlifting-also-known-as-strength-or-resistanc-1755457007047",
  "training-smarter-with-rpe-how-to-gauge-effort-in-1755691149845",
  "man-squatting-with-barbell-with-wearable-bracelet",
]

try {
  // List all blog posts
  console.log("[v0] Fetching all blog posts from blob storage...")
  const { blobs } = await list({ prefix: "blog/" })

  console.log(`[v0] Found ${blobs.length} total blog files`)

  // Find and delete matching posts
  let deletedCount = 0

  for (const blob of blobs) {
    const fileName = blob.pathname.replace("blog/", "").replace(".json", "")

    // Check if this blob matches any of the posts to remove
    const shouldRemove = postsToRemove.some((postSlug) => {
      return fileName === postSlug || fileName.includes(postSlug) || postSlug.includes(fileName)
    })

    if (shouldRemove) {
      console.log(`[v0] Deleting: ${blob.pathname}`)
      await del(blob.url)
      deletedCount++
    }
  }

  console.log(`[v0] Successfully deleted ${deletedCount} blog posts`)

  // List remaining posts for verification
  const { blobs: remainingBlobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Remaining blog posts: ${remainingBlobs.length}`)

  remainingBlobs.forEach((blob) => {
    const fileName = blob.pathname.replace("blog/", "").replace(".json", "")
    console.log(`[v0] - ${fileName}`)
  })
} catch (error) {
  console.error("[v0] Error removing blog posts:", error)
}
