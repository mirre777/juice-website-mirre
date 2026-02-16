import { list, put } from "@vercel/blob"
import matter from "gray-matter"

async function checkAndFixInterviewImage() {
  try {
    console.log("[v0] ===== Checking Interview Blob Storage =====")

    // List all blobs with interviews/ prefix
    const blobs = await list({ prefix: "interviews/" })
    console.log(`[v0] Found ${blobs.blobs.length} interview blobs`)

    blobs.blobs.forEach((blob, index) => {
      console.log(`[v0] Blob ${index + 1}:`)
      console.log(`[v0]   - pathname: ${blob.pathname}`)
      console.log(`[v0]   - url: ${blob.url}`)
      console.log(`[v0]   - uploadedAt: ${blob.uploadedAt}`)
    })

    // Find the Lena interview
    const lenaBlob = blobs.blobs.find(
      (blob) =>
        blob.pathname.toLowerCase().includes("lena") || blob.pathname.toLowerCase().includes("strength-lab-vienna"),
    )

    if (!lenaBlob) {
      console.log("[v0] ❌ Lena interview not found in Blob storage!")
      console.log(
        "[v0] Available blobs:",
        blobs.blobs.map((b) => b.pathname),
      )
      return
    }

    console.log("[v0] ✅ Found Lena interview:", lenaBlob.pathname)

    // Fetch and parse the interview
    const response = await fetch(lenaBlob.downloadUrl)
    const content = await response.text()
    const { data: frontmatter, content: markdownContent } = matter(content)

    console.log("[v0] Current frontmatter:")
    console.log(JSON.stringify(frontmatter, null, 2))

    // Update the image to the new one
    const newImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/general-1759840218359.webp"

    const updatedFrontmatter = {
      ...frontmatter,
      image: newImageUrl,
      tags: ["Dynamic"], // Remove duplicate "Interview" tag
    }

    console.log("[v0] Updated frontmatter:")
    console.log(JSON.stringify(updatedFrontmatter, null, 2))

    // Reconstruct the markdown
    const updatedContent = matter.stringify(markdownContent, updatedFrontmatter)

    // Upload back to Blob storage
    console.log("[v0] Uploading updated interview...")
    await put(lenaBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/markdown",
      allowOverwrite: true,
    })

    console.log("[v0] ✅ Interview updated successfully!")
    console.log("[v0] New image URL:", newImageUrl)
    console.log("[v0] Tags fixed: removed duplicate 'Interview'")
  } catch (error) {
    console.error("[v0] ❌ Error:", error)
    console.error("[v0] Stack:", error.stack)
  }
}

checkAndFixInterviewImage()
