// This script checks what's in your blob storage
const { list } = require("@vercel/blob")

async function debugBlobStorage() {
  console.log("DEBUGGING BLOB STORAGE CONTENTS")
  console.log("=============================")

  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
  console.log(`Token available: ${!!BLOB_TOKEN}`)
  console.log(`Token length: ${BLOB_TOKEN?.length || 0}`)

  if (!BLOB_TOKEN) {
    console.error("No BLOB_READ_WRITE_TOKEN found")
    return
  }

  try {
    // Get all blobs
    const { blobs } = await list({ token: BLOB_TOKEN })
    console.log(`Found ${blobs.length} total blobs:`)

    blobs.forEach((blob, i) => {
      console.log(`${i + 1}. ${blob.pathname} (${blob.size} bytes)`)
    })

    // Check for blog/ prefix
    const blogBlobs = blobs.filter((blob) => blob.pathname.startsWith("blog/"))
    console.log(`\nFound ${blogBlobs.length} blobs with blog/ prefix:`)

    blogBlobs.forEach((blob, i) => {
      console.log(`${i + 1}. ${blob.pathname} (${blob.size} bytes)`)
    })

    // Check for markdown files
    const markdownBlobs = blobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`\nFound ${markdownBlobs.length} markdown files:`)

    markdownBlobs.forEach((blob, i) => {
      console.log(`${i + 1}. ${blob.pathname} (${blob.size} bytes)`)
    })

    // Try to fetch content from first markdown file
    if (markdownBlobs.length > 0) {
      console.log(`\nTrying to fetch content from: ${markdownBlobs[0].pathname}`)

      try {
        const response = await fetch(markdownBlobs[0].url, {
          headers: {
            Authorization: `Bearer ${BLOB_TOKEN}`,
          },
        })

        if (response.ok) {
          const content = await response.text()
          console.log(`Successfully fetched content (${content.length} chars):`)
          console.log(content.substring(0, 300) + "...")
        } else {
          console.error(`Failed to fetch content: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Error fetching content: ${error.message}`)
      }
    }
  } catch (error) {
    console.error(`Error listing blobs: ${error.message}`)
  }
}

debugBlobStorage()
