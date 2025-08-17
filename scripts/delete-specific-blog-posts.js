import { list, del } from "@vercel/blob"

// List of specific slugs to delete based on the user's request
const SLUGS_TO_DELETE = [
  "test-post-or-my-brain-on-auto-pilot",
  "lift-weights-look-great-feel-amazing-no-really",
  "weightlifting-also-known-as-strength-or",
  "httpsfilesslackcomfiles-tmbt07esv7cp7h-f09at31byr2-ae7bbacb8aoptimusprime07375thepersonontheleftisourmaincharacte640434d1-f779-4dc3-b033-ca19f8077ba73720png-weightlifting-also-known-as-strength",
  "weightlifting-not-just-for-meatheads-anymore-but-theyre-welcome-too",
  "weightlifting-not-just-for-meatheads-anymore-or-is-it",
  "-sleep-tracking-helpful-snooze-or-data-doze",
  "sleep-tracking-helpful-snooze-or-data-doze", // Also check without leading dash
  "-gym-bro-science-fact-fiction-or-just-really-good-marketing",
  "gym-bro-science-fact-fiction-or-just-really-good-marketing", // Also check without leading dash
  "-goodbye-spreadsheets-hello-ai-sidekick",
  "goodbye-spreadsheets-hello-ai-sidekick", // Also check without leading dash
  "-the-rise-of-the-machines-in-coaching-spoiler-not-quite-",
  "the-rise-of-the-machines-in-coaching-spoiler-not-quite-", // Also check without leading dash
  "the-rise-of-the-machines-in-coaching-spoiler-not-quite", // Also check without trailing dash
  "-is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace",
  "is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace", // Also check without leading dash
  "-is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world-",
  "is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world-", // Also check without leading dash
  "is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world", // Also check without trailing dash
  "-ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick",
  "ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick", // Also check without leading dash
]

const BLOG_CONTENT_PATH = "blog/"

async function deleteSpecificBlogPosts() {
  console.log("🔍 Starting blog post cleanup...")
  console.log(`📋 Looking for ${SLUGS_TO_DELETE.length} specific posts to delete`)

  try {
    // Get all blobs in the blog directory
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH })
    console.log(`📁 Found ${blobs.length} total files in blog directory`)

    let deletedCount = 0
    const deletedPosts = []

    // Process each blob
    for (const blob of blobs) {
      const filename = blob.pathname.replace(BLOG_CONTENT_PATH, "")
      const slug = filename.replace(/\.(md|jpg|jpeg|png|webp|gif)$/, "")

      // Check if this slug should be deleted
      if (SLUGS_TO_DELETE.includes(slug)) {
        console.log(`🗑️  Deleting: ${blob.pathname}`)

        try {
          await del(blob.url)
          deletedCount++

          // Track unique post slugs (not individual files)
          if (!deletedPosts.includes(slug)) {
            deletedPosts.push(slug)
          }

          console.log(`✅ Successfully deleted: ${blob.pathname}`)
        } catch (deleteError) {
          console.error(`❌ Failed to delete ${blob.pathname}:`, deleteError)
        }
      }
    }

    console.log(`\n🎉 Cleanup completed!`)
    console.log(`📊 Deleted ${deletedCount} files from ${deletedPosts.length} blog posts`)

    if (deletedPosts.length > 0) {
      console.log(`\n🗑️  Deleted posts:`)
      deletedPosts.forEach((slug) => console.log(`   - ${slug}`))
    }

    // Now get remaining posts and count them
    console.log(`\n🔍 Checking remaining blog posts...`)
    await listRemainingPosts()
  } catch (error) {
    console.error("❌ Error during cleanup:", error)
  }
}

async function listRemainingPosts() {
  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH })

    // Filter to only .md files (actual blog posts)
    const markdownFiles = blobs.filter((blob) => blob.pathname.endsWith(".md"))

    console.log(`\n📈 REMAINING BLOG POSTS: ${markdownFiles.length}`)
    console.log(`\n📝 Complete list of live blog posts:`)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.juice.fitness"

    markdownFiles.forEach((blob, index) => {
      const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(".md", "")
      const fullUrl = `${baseUrl}/blog/${slug}`
      console.log(`   ${index + 1}. ${fullUrl}`)
    })

    return markdownFiles.length
  } catch (error) {
    console.error("❌ Error listing remaining posts:", error)
    return 0
  }
}

// Run the cleanup
deleteSpecificBlogPosts()
