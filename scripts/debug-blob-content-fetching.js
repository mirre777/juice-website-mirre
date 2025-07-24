console.log("🔍 Starting Blob Content Debug Script...")

async function debugBlobContentFetching() {
  try {
    // Check environment variables
    console.log("📋 Environment Check:")
    const token = process.env.BLOB_READ_WRITE_TOKEN
    console.log("BLOB_READ_WRITE_TOKEN exists:", !!token)
    console.log("Token length:", token ? token.length : 0)

    if (!token) {
      console.error("❌ BLOB_READ_WRITE_TOKEN is not set!")
      return
    }

    // List all blobs
    console.log("\n📁 Fetching all blobs from storage...")
    const listResponse = await fetch("https://blob.vercel-storage.com/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!listResponse.ok) {
      console.error("❌ Failed to list blobs:", listResponse.status, listResponse.statusText)
      return
    }

    const blobData = await listResponse.json()
    console.log("📊 Total blobs found:", blobData.blobs?.length || 0)

    if (blobData.blobs && blobData.blobs.length > 0) {
      console.log("\n📋 All blobs:")
      blobData.blobs.forEach((blob, index) => {
        console.log(`${index + 1}. ${blob.pathname} (${blob.size} bytes)`)
      })
    }

    // Filter for blog content
    const blogBlobs =
      blobData.blobs?.filter(
        (blob) => blob.pathname.startsWith("blog/") || blob.pathname.includes("blog") || blob.pathname.endsWith(".md"),
      ) || []

    console.log("\n📝 Blog-related blobs found:", blogBlobs.length)

    if (blogBlobs.length === 0) {
      console.log("⚠️ No blog-related files found in blob storage!")
      console.log("💡 Expected files should be in format: blog/post-slug.md")
      return
    }

    // Analyze each blog file
    console.log("\n🔍 Analyzing blog content...")

    for (const blob of blogBlobs) {
      console.log(`\n📄 Analyzing: ${blob.pathname}`)

      try {
        const contentResponse = await fetch(blob.url)
        if (!contentResponse.ok) {
          console.error(`❌ Failed to fetch content for ${blob.pathname}:`, contentResponse.status)
          continue
        }

        const content = await contentResponse.text()
        console.log(`📏 Content length: ${content.length} characters`)

        // Show content preview
        const preview = content.substring(0, 200).replace(/\n/g, "\\n")
        console.log(`👀 Content preview: "${preview}..."`)

        // Check for frontmatter
        const hasFrontmatter = content.startsWith("---")
        console.log(`📋 Has frontmatter: ${hasFrontmatter}`)

        // Check for emoji in title
        const emojiRegex =
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
        const hasEmoji = emojiRegex.test(content)
        console.log(`🏋️‍♀️ Contains emoji: ${hasEmoji}`)

        // Check for TL;DR
        const hasTLDR = content.toLowerCase().includes("tl;dr") || content.toLowerCase().includes("tldr")
        console.log(`📝 Has TL;DR section: ${hasTLDR}`)

        // Extract potential title
        const lines = content.split("\n")
        const titleLine = lines.find((line) => line.startsWith("# ") || line.includes("🏋️‍♀️"))
        if (titleLine) {
          console.log(`📰 Found title: "${titleLine}"`)
        }
      } catch (error) {
        console.error(`❌ Error processing ${blob.pathname}:`, error.message)
      }
    }

    // Check for specific target post
    console.log("\n🎯 Checking for specific target post...")
    const targetSlug = "-top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year"
    const targetPath = `blog/${targetSlug}.md`

    const targetBlob = blobData.blobs?.find(
      (blob) => blob.pathname === targetPath || blob.pathname.includes(targetSlug),
    )

    if (targetBlob) {
      console.log(`✅ Found target post: ${targetBlob.pathname}`)
      console.log(`📏 Size: ${targetBlob.size} bytes`)
      console.log(`🔗 URL: ${targetBlob.url}`)
    } else {
      console.log(`❌ Target post not found: ${targetPath}`)
      console.log("💡 Available blog files:")
      blogBlobs.forEach((blob) => console.log(`   - ${blob.pathname}`))
    }
  } catch (error) {
    console.error("❌ Debug script error:", error)
  }
}

// Run the debug function
debugBlobContentFetching()
  .then(() => console.log("\n✅ Debug script completed"))
  .catch((error) => console.error("❌ Debug script failed:", error))
