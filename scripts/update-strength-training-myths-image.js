import { put, list, del } from "@vercel/blob"

console.log("[v0] Starting to update strength training myths blog post image...")

try {
  // List all blog posts to find the one we want to update
  const { blobs } = await list({ prefix: "blog/" })
  console.log(`[v0] Found ${blobs.length} blog posts in storage`)

  // Find the specific post
  const targetSlug = "strength-training-myths-busted-content-1-law222276mpf6kac2xp4e90043hyc9"
  const targetPost = blobs.find(
    (blob) => blob.pathname.includes(targetSlug) || blob.pathname.includes("strength-training-myths-busted-content"),
  )

  if (!targetPost) {
    console.log("[v0] Target post not found. Available posts:")
    blobs.forEach((blob) => console.log(`[v0] - ${blob.pathname}`))
    throw new Error("Strength training myths post not found")
  }

  console.log(`[v0] Found target post: ${targetPost.pathname}`)

  // Fetch the current post content
  const response = await fetch(targetPost.url)
  const currentContent = await response.text()
  console.log("[v0] Retrieved current post content")

  // Parse the frontmatter and content
  const frontmatterMatch = currentContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) {
    throw new Error("Invalid post format - no frontmatter found")
  }

  const [, frontmatter, content] = frontmatterMatch

  // Update the image URL in the frontmatter
  const newImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_woman_on_phone_nutrition%20trends-hGy3Z57LlMV53ejuW2X1f9pxcGIkUU.png"
  const updatedFrontmatter = frontmatter.replace(/image:\s*"[^"]*"/, `image: "${newImageUrl}"`)

  // Create the updated post content
  const updatedContent = `---\n${updatedFrontmatter}\n---\n${content}`

  // Delete the old post
  await del(targetPost.url)
  console.log("[v0] Deleted old post")

  // Create the new post with updated image
  const newBlob = await put(targetPost.pathname, updatedContent, {
    access: "public",
    contentType: "text/markdown",
  })

  console.log(`[v0] Successfully updated post with new image: ${newImageUrl}`)
  console.log(`[v0] Updated post URL: ${newBlob.url}`)
} catch (error) {
  console.error("[v0] Error updating strength training myths post:", error)
  throw error
}
