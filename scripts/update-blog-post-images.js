import { list, del, put } from "@vercel/blob"

async function updateBlogPostImages() {
  try {
    console.log("[v0] Starting blog post image updates...")

    // List all blog posts
    const { blobs } = await list({ prefix: "blog/" })
    console.log(`[v0] Found ${blobs.length} blog posts`)

    // New image URLs
    const newDumbbellImage =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_dumbbells2%20%281%29-KhQwXpAOQbLcfClNFeWNtiqnLYvJaO.png"
    const newBookingImage =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_how%20to%20get%20more%20clients%20with%20a%20booking%20page-qt25O8vwyipVap43cmLJ1iyJdiHf3y.png"

    // Posts to update with their new images
    const postsToUpdate = [
      {
        searchTerm: "training-smarter-with-rpe-how-to-gauge-effort-in-1755691149845",
        newImage: newDumbbellImage,
        description: "RPE training post",
      },
      {
        searchTerm: "weightlifting-also-known-as-strength-or-resistanc-1755457007047",
        newImage: newDumbbellImage,
        description: "Weightlifting post",
      },
    ]

    let updatedCount = 0

    for (const postUpdate of postsToUpdate) {
      console.log(`[v0] Looking for ${postUpdate.description}...`)

      // Find the post
      const matchingBlob = blobs.find(
        (blob) =>
          blob.pathname.includes(postUpdate.searchTerm) ||
          blob.pathname.toLowerCase().includes(postUpdate.searchTerm.toLowerCase()),
      )

      if (matchingBlob) {
        console.log(`[v0] Found ${postUpdate.description}: ${matchingBlob.pathname}`)

        // Fetch current content
        const response = await fetch(matchingBlob.url)
        const content = await response.text()

        // Update the image URL in the frontmatter
        const updatedContent = content.replace(/^image:\s*"[^"]*"/m, `image: "${postUpdate.newImage}"`)

        if (updatedContent !== content) {
          // Delete old version
          await del(matchingBlob.url)

          // Upload updated version
          await put(matchingBlob.pathname, updatedContent, {
            access: "public",
            contentType: "text/markdown",
          })

          console.log(`[v0] Updated ${postUpdate.description} with new image`)
          updatedCount++
        } else {
          console.log(`[v0] No image field found in ${postUpdate.description}`)
        }
      } else {
        console.log(`[v0] Could not find ${postUpdate.description}`)
      }
    }

    console.log(`[v0] Successfully updated ${updatedCount} blog post images`)

    // List remaining posts
    const { blobs: remainingBlobs } = await list({ prefix: "blog/" })
    console.log(`[v0] Remaining blog posts: ${remainingBlobs.length}`)
    remainingBlobs.forEach((blob) => {
      console.log(`[v0] - ${blob.pathname}`)
    })
  } catch (error) {
    console.error("[v0] Error updating blog post images:", error)
  }
}

updateBlogPostImages()
