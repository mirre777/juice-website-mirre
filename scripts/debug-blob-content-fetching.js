// Debug script to check what content we're fetching from Vercel Blob
const { list } = require("@vercel/blob")

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const BLOG_CONTENT_PATH = "blog/"

async function debugBlobContentFetching() {
  console.log("🔍 DEBUG: Blob Content Fetching Analysis")
  console.log("=".repeat(50))

  // Check environment variables
  console.log("📋 Environment Check:")
  console.log(`BLOB_READ_WRITE_TOKEN: ${BLOB_TOKEN ? "✅ SET" : "❌ NOT SET"}`)
  console.log(`Blog content path: ${BLOG_CONTENT_PATH}`)
  console.log("")

  if (!BLOB_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN is not set. Cannot fetch content.")
    return
  }

  try {
    // List all blobs
    console.log("📁 Listing all blobs...")
    const { blobs } = await list({ token: BLOB_TOKEN })
    console.log(`Found ${blobs.length} total blobs`)

    if (blobs.length === 0) {
      console.log("❌ No blobs found in storage")
      return
    }

    console.log("\n📋 All blobs in storage:")
    blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname} (${blob.size} bytes)`)
    })

    // Filter blog content
    console.log(`\n📝 Filtering blobs with prefix "${BLOG_CONTENT_PATH}":`)
    const blogBlobs = blobs.filter((blob) => blob.pathname.startsWith(BLOG_CONTENT_PATH))
    console.log(`Found ${blogBlobs.length} blog-related blobs`)

    if (blogBlobs.length === 0) {
      console.log("❌ No blog content found with the specified prefix")
      return
    }

    // Check markdown files specifically
    console.log("\n📄 Markdown files (.md):")
    const markdownBlobs = blogBlobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`Found ${markdownBlobs.length} markdown files`)

    if (markdownBlobs.length === 0) {
      console.log("❌ No markdown files found")
      return
    }

    // Analyze each markdown file
    console.log("\n🔍 Analyzing markdown files:")
    for (const blob of markdownBlobs) {
      console.log(`\n--- ${blob.pathname} ---`)
      console.log(`Size: ${blob.size} bytes`)
      console.log(`URL: ${blob.url}`)

      // Extract slug
      const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
      console.log(`Extracted slug: "${slug}"`)

      try {
        // Fetch content
        console.log("Fetching content...")
        const response = await fetch(blob.url)

        if (!response.ok) {
          console.log(`❌ Failed to fetch: ${response.status} ${response.statusText}`)
          continue
        }

        const content = await response.text()
        console.log(`✅ Content fetched: ${content.length} characters`)

        // Show content preview
        console.log("📖 Content preview (first 300 chars):")
        console.log(content.substring(0, 300) + "...")

        // Check for frontmatter
        if (content.startsWith("---")) {
          console.log("✅ Has frontmatter")
          const frontmatterEnd = content.indexOf("---", 3)
          if (frontmatterEnd > -1) {
            const frontmatter = content.substring(3, frontmatterEnd)
            console.log("📋 Frontmatter:")
            console.log(frontmatter)
          }
        } else {
          console.log("⚠️  No frontmatter detected")
        }

        // Check for emoji title
        const emojiTitleRegex = /^([\p{Emoji}\u200d]+.*?)[\r\n]/u
        const titleMatch = content.match(emojiTitleRegex)
        if (titleMatch) {
          console.log(`✅ Emoji title found: "${titleMatch[1]}"`)
        } else {
          console.log("⚠️  No emoji title found")
        }

        // Check for TL;DR
        const tldrRegex = /TL;DR:?\s*(.*?)[\r\n]/
        const tldrMatch = content.match(tldrRegex)
        if (tldrMatch) {
          console.log(`✅ TL;DR found: "${tldrMatch[1].substring(0, 100)}..."`)
        } else {
          console.log("⚠️  No TL;DR found")
        }
      } catch (error) {
        console.log(`❌ Error fetching content: ${error.message}`)
      }
    }

    // Test specific slug
    console.log(
      "\n🎯 Testing specific slug: '-top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year'",
    )
    const targetSlug = "-top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year"
    const targetPath = `${BLOG_CONTENT_PATH}${targetSlug}.md`

    const targetBlob = blobs.find((b) => b.pathname === targetPath)
    if (targetBlob) {
      console.log(`✅ Found target blob: ${targetBlob.pathname}`)
      console.log(`Size: ${targetBlob.size} bytes`)
      console.log(`URL: ${targetBlob.url}`)
    } else {
      console.log(`❌ Target blob not found. Looking for: ${targetPath}`)
      console.log("Available blog paths:")
      blogBlobs.forEach((blob) => console.log(`  - ${blob.pathname}`))
    }
  } catch (error) {
    console.error("❌ Error during blob analysis:", error)
  }
}

// Run the debug function
debugBlobContentFetching()
  .then(() => {
    console.log("\n✅ Debug analysis complete")
  })
  .catch((error) => {
    console.error("❌ Debug script failed:", error)
  })
