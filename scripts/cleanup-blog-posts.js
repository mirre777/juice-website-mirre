import { list, del } from "@vercel/blob"

const BLOG_CONTENT_PATH = "blog/"

// URLs to remove (extracted from the text attachment)
const URLS_TO_REMOVE = [
  "test-post-or-my-brain-on-auto-pilot",
  "lift-weights-look-great-feel-amazing-no-really",
  "weightlifting-also-known-as-strength-or",
  "httpsfilesslackcomfiles-tmbt07esv7cp7h-f09at31byr2-ae7bbacb8aoptimusprime07375thepersonontheleftisourmaincharacte640434d1-f779-4dc3-b033-ca19f8077ba73720png-weightlifting-also-known-as-strength",
  "weightlifting-not-just-for-meatheads-anymore-but-theyre-welcome-too",
  "weightlifting-not-just-for-meatheads-anymore-or-is-it",
  "sleep-tracking-helpful-snooze-or-data-doze", // without leading dash
  "-sleep-tracking-helpful-snooze-or-data-doze", // with leading dash
  "gym-bro-science-fact-fiction-or-just-really-good-marketing",
  "-gym-bro-science-fact-fiction-or-just-really-good-marketing",
  "goodbye-spreadsheets-hello-ai-sidekick",
  "-goodbye-spreadsheets-hello-ai-sidekick",
  "the-rise-of-the-machines-in-coaching-spoiler-not-quite",
  "-the-rise-of-the-machines-in-coaching-spoiler-not-quite-",
  "is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace",
  "-is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace",
  "is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world",
  "-is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world-",
  "ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick",
  "-ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick",
]

function cleanSlugFromFilename(filename) {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

// Function to check if two strings are similar (1-2 character differences)
function isSimilar(str1, str2, maxDifferences = 2) {
  if (Math.abs(str1.length - str2.length) > maxDifferences) {
    return false
  }

  let differences = 0
  const minLength = Math.min(str1.length, str2.length)
  const maxLength = Math.max(str1.length, str2.length)

  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      differences++
      if (differences > maxDifferences) {
        return false
      }
    }
  }

  // Add length difference to differences count
  differences += maxLength - minLength

  return differences <= maxDifferences
}

async function cleanupBlogPosts() {
  console.log("[v0] Starting blog post cleanup...")

  try {
    // Get all blobs in the blog directory
    const blobs = await list({ prefix: BLOG_CONTENT_PATH })
    console.log(`[v0] Found ${blobs.blobs.length} total blobs in blog directory`)

    const deletedPosts = []
    const remainingPosts = []

    for (const blob of blobs.blobs) {
      const filename = blob.pathname.replace(BLOG_CONTENT_PATH, "")
      const rawSlug = filename.replace(/\.(md|jpg|jpeg|png|webp|gif)$/, "")
      const cleanSlug = cleanSlugFromFilename(rawSlug)

      // Check if this slug should be removed (exact match or similar)
      let shouldDelete = false
      let matchedUrl = ""

      for (const urlToRemove of URLS_TO_REMOVE) {
        if (cleanSlug === urlToRemove || rawSlug === urlToRemove) {
          shouldDelete = true
          matchedUrl = urlToRemove
          break
        }

        // Check for similar URLs (1-2 character differences)
        if (isSimilar(cleanSlug, urlToRemove) || isSimilar(rawSlug, urlToRemove)) {
          shouldDelete = true
          matchedUrl = `${urlToRemove} (similar to ${cleanSlug})`
          break
        }
      }

      if (shouldDelete) {
        try {
          await del(blob.url)
          deletedPosts.push({
            filename,
            slug: cleanSlug,
            matchedUrl,
            url: blob.url,
          })
          console.log(`[v0] Deleted: ${filename} (matched: ${matchedUrl})`)
        } catch (error) {
          console.error(`[v0] Failed to delete ${filename}:`, error)
        }
      } else {
        // Only count markdown files as blog posts for the final count
        if (filename.endsWith(".md")) {
          remainingPosts.push({
            filename,
            slug: cleanSlug,
            url: `https://www.juice.fitness/blog/${cleanSlug}`,
          })
        }
      }
    }

    console.log(`\n[v0] Cleanup Summary:`)
    console.log(`[v0] Deleted ${deletedPosts.length} files`)
    console.log(`[v0] Remaining blog posts: ${remainingPosts.length}`)

    console.log(`\n[v0] Deleted files:`)
    deletedPosts.forEach((post) => {
      console.log(`[v0] - ${post.filename} (${post.matchedUrl})`)
    })

    console.log(`\n[v0] Remaining blog posts with URLs:`)
    remainingPosts.forEach((post) => {
      console.log(`[v0] - ${post.url}`)
    })

    return {
      deleted: deletedPosts.length,
      remaining: remainingPosts.length,
      remainingPosts: remainingPosts,
    }
  } catch (error) {
    console.error("[v0] Error during cleanup:", error)
    throw error
  }
}

// Run the cleanup
cleanupBlogPosts()
  .then((result) => {
    console.log(`\n[v0] Final Result: ${result.remaining} blog posts remaining after deleting ${result.deleted} files`)
  })
  .catch((error) => {
    console.error("[v0] Cleanup failed:", error)
  })
