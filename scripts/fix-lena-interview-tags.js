import { put, list } from "@vercel/blob"

async function fixLenaInterviewTags() {
  console.log("Starting to fix Lena interview tags...")

  try {
    // List all interview blobs
    const { blobs } = await list({ prefix: "interviews/" })
    console.log(`Found ${blobs.length} interview blobs`)

    // Find the Lena interview
    const lenaBlob = blobs.find((blob) => blob.pathname.includes("lena-strength-lab-vienna"))

    if (!lenaBlob) {
      console.error("Could not find Lena interview blob")
      return
    }

    console.log(`Found Lena interview at: ${lenaBlob.pathname}`)

    // Fetch the current content
    const response = await fetch(lenaBlob.downloadUrl)
    const content = await response.text()

    console.log("Current content preview:")
    console.log(content.substring(0, 500))

    // Update the frontmatter to remove "Interview" from tags
    // The frontmatter should only have "Dynamic" in tags, not "Interview"
    const updatedContent = content.replace(/tags:\s*\[.*?\]/s, 'tags: ["Dynamic"]')

    console.log("\nUpdated content preview:")
    console.log(updatedContent.substring(0, 500))

    // Upload the fixed content
    await put(lenaBlob.pathname, updatedContent, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/markdown",
    })

    console.log("\n✅ Successfully updated Lena interview - removed duplicate 'Interview' tag")
  } catch (error) {
    console.error("Error fixing interview tags:", error)
  }
}

fixLenaInterviewTags()
