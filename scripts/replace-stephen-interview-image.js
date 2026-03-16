import { list, put } from "@vercel/blob"
import matter from "gray-matter"

// Usage: Modify the NEW_IMAGE_URL below, then run this script

const NEW_IMAGE_URL =
  "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/client%20and%20trainer%20in%20gym%20drinking%20coffee-1760102352392.webp"

async function replaceStephenInterviewImage() {
  try {
    console.log("[v0] ===== Replacing Stephen Neider Interview Image =====")

    // List all interview blobs
    const blobs = await list({ prefix: "interviews/" })
    console.log(`[v0] Found ${blobs.blobs.length} interview blobs`)

    // Find Stephen Neider's interview
    const stephenBlob = blobs.blobs.find(
      (blob) =>
        blob.pathname.includes("stephen-neider") ||
        blob.pathname.includes("stephen") ||
        blob.pathname.includes("mobility-training"),
    )

    if (!stephenBlob) {
      console.log("[v0] ❌ Stephen Neider interview not found in Blob storage!")
      console.log(
        "[v0] Available interview blobs:",
        blobs.blobs.map((b) => b.pathname),
      )
      return
    }

    console.log("[v0] ✅ Found Stephen Neider interview:", stephenBlob.pathname)

    // Fetch and parse the interview
    const response = await fetch(stephenBlob.downloadUrl)
    const content = await response.text()
    const { data: frontmatter, content: markdownContent } = matter(content)

    console.log("[v0] Current frontmatter:")
    console.log(JSON.stringify(frontmatter, null, 2))
    console.log("[v0] Current image:", frontmatter.image)

    // Check if new image URL is provided
    if (NEW_IMAGE_URL === "YOUR_NEW_IMAGE_URL_HERE") {
      console.log("[v0] ⚠️  Please update NEW_IMAGE_URL in the script with your new image URL")
      console.log("[v0] You can:")
      console.log("[v0]   1. Upload an image to Blob storage manually")
      console.log("[v0]   2. Use an existing image URL")
      console.log("[v0]   3. Copy the URL from the admin panel's 'Recently Uploaded Images'")
      return
    }

    // Update the image
    const updatedFrontmatter = {
      ...frontmatter,
      image: NEW_IMAGE_URL,
    }

    console.log("[v0] Updated frontmatter:")
    console.log(JSON.stringify(updatedFrontmatter, null, 2))
    console.log("[v0] New image:", NEW_IMAGE_URL)

    // Reconstruct the markdown
    const updatedContent = matter.stringify(markdownContent, updatedFrontmatter)

    // Upload back to Blob storage
    console.log("[v0] Uploading updated interview...")
    await put(stephenBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/markdown",
      allowOverwrite: true,
    })

    console.log("[v0] ✅ Interview image updated successfully!")
    console.log("[v0] Old image:", frontmatter.image)
    console.log("[v0] New image:", NEW_IMAGE_URL)
  } catch (error) {
    console.error("[v0] ❌ Error:", error)
    console.error("[v0] Stack:", error.stack)
  }
}

replaceStephenInterviewImage()
