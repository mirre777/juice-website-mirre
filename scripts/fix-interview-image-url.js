import { list, put, del } from "@vercel/blob"

console.log("[v0] Looking for interview markdown file...")

// List all blobs to find the interview markdown
const { blobs } = await list()
console.log("[v0] Total blobs found:", blobs.length)

// Find the interview markdown file
const interviewBlob = blobs.find(
  (blob) => blob.pathname.includes("interviews/") && blob.pathname.includes("lena-strength-lab-vienna"),
)

if (!interviewBlob) {
  console.log("[v0] Interview markdown not found!")
  console.log(
    "[v0] Available interview files:",
    blobs.filter((b) => b.pathname.includes("interviews/")),
  )
  throw new Error("Interview markdown file not found")
}

console.log("[v0] Found interview markdown:", interviewBlob.pathname)
console.log("[v0] URL:", interviewBlob.url)

// Fetch the interview content
const response = await fetch(interviewBlob.url)
const content = await response.text()

console.log("[v0] Current content length:", content.length)
console.log("[v0] First 500 characters:")
console.log(content.substring(0, 500))

// Parse frontmatter
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
if (!frontmatterMatch) {
  throw new Error("No frontmatter found")
}

const frontmatterText = frontmatterMatch[1]
console.log("[v0] Current frontmatter:")
console.log(frontmatterText)

// Check current image URL
const imageMatch = frontmatterText.match(/image:\s*["']?([^"'\n]+)["']?/)
console.log("[v0] Current image URL:", imageMatch ? imageMatch[1] : "NOT FOUND")

// The new image URL from the recent upload
const newImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/general-1759840218359.webp"

console.log("[v0] New image URL:", newImageUrl)

// Update the image URL in frontmatter
let updatedContent = content.replace(/image:\s*["']?[^"'\n]+["']?/, `image: "${newImageUrl}"`)

// Also fix the duplicate "Interview" tags while we're at it
updatedContent = updatedContent.replace(/tags:\s*\[(.*?)\]/s, (match, tagsList) => {
  const tags = tagsList
    .split(",")
    .map((t) => t.trim().replace(/['"]/g, ""))
    .filter((t) => t)
  // Remove duplicate "Interview" tags, keep only one
  const uniqueTags = [...new Set(tags)]
  return `tags: [${uniqueTags.map((t) => `"${t}"`).join(", ")}]`
})

console.log("[v0] Updated content (first 500 chars):")
console.log(updatedContent.substring(0, 500))

console.log("[v0] Deleting old interview blob...")
await del(interviewBlob.url)
console.log("[v0] Old blob deleted successfully")

// Upload the updated content back to Blob storage
console.log("[v0] Uploading updated interview...")
const uploadResult = await put(interviewBlob.pathname, updatedContent, {
  access: "public",
  contentType: "text/markdown",
  addRandomSuffix: false,
})

console.log("[v0] Upload successful!")
console.log("[v0] New URL:", uploadResult.url)
console.log("[v0] Interview image has been updated and duplicate tags removed!")
