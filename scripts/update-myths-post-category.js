import { list, del, put } from "@vercel/blob"

console.log("[v0] Starting to update strength training myths post category...")

try {
  // List all blog posts
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} blog posts in storage`)

  // Find the specific post
  const targetSlug = "strength-training-myths-busted-content-1-law222276mpf6kac2xp4e90043hyc9"
  const targetPost = blobs.find(
    (blob) => blob.pathname.includes(targetSlug) || blob.pathname.includes("strength-training-myths-busted-content"),
  )

  if (!targetPost) {
    console.log("[v0] Strength training myths post not found")
    console.log("[v0] Available posts:")
    blobs.forEach((blob) => console.log(`[v0] - ${blob.pathname}`))
    process.exit(1)
  }

  console.log(`[v0] Found target post: ${targetPost.pathname}`)

  // Fetch the current post content
  const response = await fetch(targetPost.url)
  const currentContent = await response.text()

  console.log("[v0] Current post content preview:")
  console.log(currentContent.substring(0, 200) + "...")

  // Update the category in the frontmatter
  const updatedContent = currentContent.replace(/category:\s*["']?myths["']?/i, 'category: "General"')

  // Also update any category references in the content
  const finalContent = updatedContent.replace(/category:\s*["']?myth["']?/i, 'category: "General"')

  if (finalContent === currentContent) {
    console.log("[v0] No category changes needed - post may already be General or have different format")
  } else {
    // Delete the old post
    await del(targetPost.url)
    console.log("[v0] Deleted old post")

    // Create the new post with updated category
    const newBlob = await put(targetPost.pathname, finalContent, {
      access: "public",
      contentType: "text/markdown",
    })

    console.log(`[v0] Updated post with General category: ${newBlob.url}`)
  }

  console.log("[v0] ✅ Successfully updated strength training myths post category to General")
} catch (error) {
  console.error("[v0] Error updating post category:", error)
  process.exit(1)
}
