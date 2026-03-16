import { list } from "@vercel/blob"

async function inspectLenaInterview() {
  try {
    console.log("[v0] Listing all blobs to find Lena interview...")

    const { blobs } = await list()

    // Find the Lena interview
    const lenaInterview = blobs.find((blob) => blob.pathname.includes("lena") && blob.pathname.includes("strength"))

    if (!lenaInterview) {
      console.log("[v0] No Lena interview found in blob storage")
      console.log(
        "[v0] Available blobs:",
        blobs.map((b) => b.pathname),
      )
      return
    }

    console.log("[v0] Found interview blob:", lenaInterview.pathname)
    console.log("[v0] URL:", lenaInterview.url)

    // Fetch the content
    const response = await fetch(lenaInterview.url)
    const content = await response.text()

    console.log("[v0] Interview content:")
    console.log(content)

    // Parse frontmatter to see current image
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      console.log("[v0] Frontmatter:")
      console.log(frontmatterMatch[1])

      const imageMatch = frontmatterMatch[1].match(/image:\s*(.+)/)
      if (imageMatch) {
        console.log("[v0] Current image URL:", imageMatch[1])
      } else {
        console.log("[v0] No image field found in frontmatter")
      }
    }
  } catch (error) {
    console.error("[v0] Error inspecting interview:", error)
  }
}

inspectLenaInterview()
