// Debug script to investigate blog content sources
// Run with: node scripts/debug-blog-blob-content.js

const { list } = require("@vercel/blob")

async function debugBlogContent() {
  console.log("=== BLOG CONTENT DEBUG ===\n")

  // Check environment variables
  console.log("1. Environment Variables:")
  console.log("BLOB_READ_WRITE_TOKEN:", process.env.BLOB_READ_WRITE_TOKEN ? "Present" : "Missing")
  console.log("Token length:", process.env.BLOB_READ_WRITE_TOKEN?.length || 0)
  console.log()

  try {
    // List all blobs with blog prefix
    console.log("2. Checking Blob Storage for blog content:")
    const { blobs } = await list({
      prefix: "blog/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log(`Found ${blobs.length} files in blob storage with 'blog/' prefix:`)

    if (blobs.length === 0) {
      console.log("❌ No blog content found in Blob storage")
    } else {
      blobs.forEach((blob, index) => {
        console.log(`${index + 1}. ${blob.pathname}`)
        console.log(`   Size: ${blob.size} bytes`)
        console.log(`   Created: ${new Date(blob.uploadedAt).toISOString()}`)
        console.log(`   URL: ${blob.url}`)
        console.log()
      })
    }

    // Try to fetch content from first blob if exists
    if (blobs.length > 0) {
      console.log("3. Sample content from first blob:")
      try {
        const response = await fetch(blobs[0].url)
        const content = await response.text()
        console.log("First 200 characters:")
        console.log(content.substring(0, 200) + "...")
      } catch (error) {
        console.log("❌ Error fetching blob content:", error.message)
      }
    }
  } catch (error) {
    console.log("❌ Error accessing Blob storage:", error.message)
    console.log("This likely means no blog content is stored in Blob storage yet.")
  }

  // Check hardcoded sample posts count
  console.log("\n4. Hardcoded Sample Posts:")
  try {
    // Import the blog module to check sample posts
    const blogModule = require("../lib/blog.ts")
    if (blogModule.SAMPLE_POSTS) {
      console.log(`Found ${blogModule.SAMPLE_POSTS.length} hardcoded sample posts`)
    } else {
      console.log("Could not access SAMPLE_POSTS from lib/blog.ts")
    }
  } catch (error) {
    console.log("Could not import blog module:", error.message)
  }

  console.log("\n=== DEBUG COMPLETE ===")
}

// Run the debug
debugBlogContent().catch(console.error)
