import { list, del } from "@vercel/blob"

console.log("[v0] Starting removal of heavy-vs-light blog post with timestamp...")

const postSlugToRemove = "heavy-vs-light-to-failure-what-lifters-should-ac-1757402471854"

try {
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} total blog files`)

  let deletedCount = 0

  for (const blob of blobs) {
    const fileName = blob.pathname.replace("blog/", "").replace(/\.(md|json)$/, "")

    if (fileName === postSlugToRemove || fileName.includes(postSlugToRemove)) {
      console.log(`[v0] Deleting: ${blob.pathname}`)
      await del(blob.url)
      deletedCount++
    }
  }

  console.log(`[v0] Successfully deleted ${deletedCount} files`)

  const { blobs: remaining } = await list({ prefix: "blog/" })
  console.log(`[v0] Remaining blog posts: ${remaining.length}`)
} catch (error) {
  console.error("[v0] Error:", error)
}
