import { list, del } from "@vercel/blob"

// List of slugs to remove (extracted from the Slack messages)
const SLUGS_TO_REMOVE = [
  "test-post-or-my-brain-on-auto-pilot",
  "lift-weights-look-great-feel-amazing-no-really",
  "weightlifting-also-known-as-strength-or",
  "httpsfilesslackcomfiles-tmbt07esv7cp7h-f09at31byr2-ae7bbacb8aoptimusprime07375thepersonontheleftisourmaincharacte640434d1-f779-4dc3-b033-ca19f8077ba73720png-weightlifting-also-known-as-strength",
  "weightlifting-not-just-for-meatheads-anymore-but-theyre-welcome-too",
  "weightlifting-not-just-for-meatheads-anymore-or-is-it",
  "sleep-tracking-helpful-snooze-or-data-doze", // without leading dash
  "-sleep-tracking-helpful-snooze-or-data-doze", // with leading dash
  "gym-bro-science-fact-fiction-or-just-really-good-marketing", // without leading dash
  "-gym-bro-science-fact-fiction-or-just-really-good-marketing", // with leading dash
  "goodbye-spreadsheets-hello-ai-sidekick", // without leading dash
  "-goodbye-spreadsheets-hello-ai-sidekick", // with leading dash
  "the-rise-of-the-machines-in-coaching-spoiler-not-quite", // without dashes
  "-the-rise-of-the-machines-in-coaching-spoiler-not-quite-", // with dashes
  "is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace", // without leading dash
  "-is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace", // with leading dash
  "is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world", // without dashes
  "-is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world-", // with dashes
  "ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick", // without leading dash
  "-ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick", // with leading dash
]

// Function to clean slug from filename (same as in lib/blog.ts)
function cleanSlugFromFilename(filename) {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

// Function to check if two slugs are similar (allowing for 1-2 character differences)
function isSimilarSlug(slug1, slug2, maxDifference = 2) {
  if (slug1 === slug2) return true

  // Simple Levenshtein distance calculation
  const matrix = []
  const len1 = slug1.length
  const len2 = slug2.length

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (slug2.charAt(i - 1) === slug1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        )
      }
    }
  }

  return matrix[len2][len1] <= maxDifference
}

async function cleanupBlogPosts() {
  console.log("🧹 Starting blog post cleanup...")

  try {
    // List all blobs with blog prefix
    const { blobs } = await list({ prefix: "blog/" })

    console.log(`📄 Found ${blobs.length} total files in blog storage`)

    // Filter for markdown files and extract slugs
    const blogPosts = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => {
        const filename = blob.pathname.replace("blog/", "").replace(".md", "")
        const cleanSlug = cleanSlugFromFilename(filename)
        return {
          blob,
          filename,
          cleanSlug,
          url: blob.url,
        }
      })

    console.log(`📝 Found ${blogPosts.length} blog post markdown files`)

    // Find posts to delete
    const postsToDelete = []
    const postsToKeep = []

    for (const post of blogPosts) {
      let shouldDelete = false

      // Check if this post matches any slug to remove
      for (const slugToRemove of SLUGS_TO_REMOVE) {
        if (isSimilarSlug(post.cleanSlug, slugToRemove) || isSimilarSlug(post.filename, slugToRemove)) {
          shouldDelete = true
          console.log(`🎯 MATCH: "${post.filename}" matches "${slugToRemove}"`)
          break
        }
      }

      if (shouldDelete) {
        postsToDelete.push(post)
      } else {
        postsToKeep.push(post)
      }
    }

    console.log(`\n🗑️  Posts to DELETE: ${postsToDelete.length}`)
    postsToDelete.forEach((post) => {
      console.log(`   - ${post.filename} (${post.cleanSlug})`)
    })

    console.log(`\n✅ Posts to KEEP: ${postsToKeep.length}`)
    postsToKeep.forEach((post) => {
      console.log(`   - ${post.filename} (${post.cleanSlug})`)
    })

    // Delete the posts
    if (postsToDelete.length > 0) {
      console.log(`\n🔥 Deleting ${postsToDelete.length} blog posts...`)

      for (const post of postsToDelete) {
        try {
          await del(post.blob.url)
          console.log(`   ✅ Deleted: ${post.filename}`)

          // Also try to delete associated image files
          const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
          for (const ext of imageExtensions) {
            const imagePath = `blog/${post.filename}${ext}`
            try {
              const imageBlobs = await list({ prefix: imagePath })
              if (imageBlobs.blobs.length > 0) {
                await del(imageBlobs.blobs[0].url)
                console.log(`   🖼️  Deleted associated image: ${post.filename}${ext}`)
              }
            } catch (imageError) {
              // Image doesn't exist, that's fine
            }
          }
        } catch (error) {
          console.error(`   ❌ Failed to delete ${post.filename}:`, error.message)
        }
      }
    }

    // Generate final report
    console.log(`\n📊 FINAL REPORT:`)
    console.log(`   Total files processed: ${blogPosts.length}`)
    console.log(`   Posts deleted: ${postsToDelete.length}`)
    console.log(`   Posts remaining: ${postsToKeep.length}`)

    if (postsToKeep.length > 0) {
      console.log(`\n🌐 LIVE BLOG POSTS WITH COMPLETE URLs:`)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.juice.fitness"

      postsToKeep.forEach((post, index) => {
        const fullUrl = `${baseUrl}/blog/${post.cleanSlug}`
        console.log(`   ${index + 1}. ${post.filename}`)
        console.log(`      URL: ${fullUrl}`)
        console.log(`      Slug: ${post.cleanSlug}`)
        console.log("")
      })

      console.log(`✨ ${postsToKeep.length} blog posts are now live!`)
    } else {
      console.log(`\n🏜️  No blog posts remaining after cleanup.`)
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error)
    throw error
  }
}

// Run the cleanup
cleanupBlogPosts()
  .then(() => {
    console.log("🎉 Blog cleanup completed successfully!")
  })
  .catch((error) => {
    console.error("💥 Blog cleanup failed:", error)
    process.exit(1)
  })
