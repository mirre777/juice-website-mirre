// Debug script to see what's in blob storage
const { list } = require("@vercel/blob")

async function debugBlobStorage() {
  console.log("🔍 DEBUGGING BLOB STORAGE CONTENTS")
  console.log("================================")

  const token = process.env.BLOB_READ_WRITE_TOKEN
  console.log("🔑 Token available:", !!token)
  console.log("🔑 Token length:", token?.length || 0)

  if (!token) {
    console.error("❌ No BLOB_READ_WRITE_TOKEN found")
    return
  }

  try {
    // First, list ALL blobs to see what's there
    console.log("\n📊 LISTING ALL BLOBS:")
    console.log("====================")
    const allBlobs = await list({ token })
    console.log(`Total blobs found: ${allBlobs.blobs.length}`)

    allBlobs.blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Size: ${blob.size} bytes`)
      console.log(`   URL: ${blob.url}`)
      console.log(`   Uploaded: ${blob.uploadedAt}`)
      console.log("")
    })

    // Then, specifically look for blog/ prefix
    console.log("\n📝 LOOKING FOR BLOG/ PREFIX:")
    console.log("============================")
    const blogBlobs = await list({ prefix: "blog/", token })
    console.log(`Blog blobs found: ${blogBlobs.blobs.length}`)

    blogBlobs.blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Is markdown: ${blob.pathname.endsWith(".md")}`)
      console.log(`   Size: ${blob.size} bytes`)
      console.log("")
    })

    // Look for any markdown files anywhere
    console.log("\n📄 ALL MARKDOWN FILES:")
    console.log("======================")
    const markdownFiles = allBlobs.blobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`Markdown files found: ${markdownFiles.length}`)

    markdownFiles.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Directory: ${blob.pathname.split("/").slice(0, -1).join("/") || "root"}`)
      console.log("")
    })

    // Try different prefixes
    console.log("\n🔍 TRYING DIFFERENT PREFIXES:")
    console.log("=============================")
    const prefixes = ["", "content/", "posts/", "blog-posts/", "content/blog/"]

    for (const prefix of prefixes) {
      try {
        const result = await list({ prefix, token })
        const mdFiles = result.blobs.filter((b) => b.pathname.endsWith(".md"))
        console.log(`Prefix "${prefix}": ${result.blobs.length} total, ${mdFiles.length} markdown`)
        if (mdFiles.length > 0) {
          mdFiles.forEach((file) => console.log(`  - ${file.pathname}`))
        }
      } catch (error) {
        console.log(`Prefix "${prefix}": Error - ${error.message}`)
      }
    }
  } catch (error) {
    console.error("💥 Error accessing blob storage:", error)
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
  }
}

debugBlobStorage().catch(console.error)
