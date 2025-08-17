import { type NextRequest, NextResponse } from "next/server"
import { list, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

// Function to slugify a string
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, "") // Remove leading and trailing dashes
}

// Manual blog cleanup function
async function manualBlogCleanup() {
  const slugsToRemove = [
    "test-post-or-my-brain-on-auto-pilot",
    "lift-weights-look-great-feel-amazing-no-really",
    "weightlifting-also-known-as-strength-or",
    "httpsfilesslackcomfiles-tmbt07esv7cp7h-f09at31byr2-ae7bbacb8aoptimusprime07375thepersonontheleftisourmaincharacte640434d1-f779-4dc3-b033-ca19f8077ba73720png-weightlifting-also-known-as-strength",
    "weightlifting-not-just-for-meatheads-anymore-but-theyre-welcome-too",
    "weightlifting-not-just-for-meatheads-anymore-or-is-it",
    "sleep-tracking-helpful-snooze-or-data-doze",
    "gym-bro-science-fact-fiction-or-just-really-good-marketing",
    "goodbye-spreadsheets-hello-ai-sidekick",
    "the-rise-of-the-machines-in-coaching-spoiler-not-quite",
    "is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace",
    "is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world",
    "ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick",
  ]

  const deletedPosts: string[] = []
  const remainingPosts: Array<{ slug: string; url: string }> = []
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.juice.fitness"

  try {
    const blobs = await list({ prefix: "blog/" })

    for (const blob of blobs.blobs) {
      const filename = blob.pathname.replace("blog/", "").replace(/\.(md|jpg|jpeg|png|webp|gif)$/, "")
      const cleanSlug = filename.replace(/^-+|-+$/g, "").toLowerCase()

      // Check if this slug matches any in our removal list (allowing for 1-2 character differences)
      const shouldRemove = slugsToRemove.some((targetSlug) => {
        const normalizedTarget = targetSlug.replace(/^-+|-+$/g, "").toLowerCase()

        // Exact match
        if (cleanSlug === normalizedTarget) return true

        // Allow for 1-2 character differences using simple string similarity
        const maxLength = Math.max(cleanSlug.length, normalizedTarget.length)
        const minLength = Math.min(cleanSlug.length, normalizedTarget.length)

        // If length difference is more than 2, skip
        if (maxLength - minLength > 2) return false

        // Count character differences
        let differences = 0
        const shorter = cleanSlug.length <= normalizedTarget.length ? cleanSlug : normalizedTarget
        const longer = cleanSlug.length > normalizedTarget.length ? cleanSlug : normalizedTarget

        for (let i = 0; i < shorter.length; i++) {
          if (shorter[i] !== longer[i]) differences++
        }
        differences += longer.length - shorter.length

        return differences <= 2
      })

      if (shouldRemove) {
        await del(blob.url)
        deletedPosts.push(cleanSlug)
        console.log(`[CLEANUP] Deleted: ${blob.pathname}`)
      } else if (blob.pathname.endsWith(".md")) {
        // This is a remaining blog post
        remainingPosts.push({
          slug: cleanSlug,
          url: `${baseUrl}/blog/${cleanSlug}`,
        })
      }
    }

    // Revalidate blog paths
    revalidatePath("/blog")

    return {
      deleted: deletedPosts,
      remaining: remainingPosts,
      deletedCount: deletedPosts.length,
      remainingCount: remainingPosts.length,
    }
  } catch (error) {
    console.error("[CLEANUP] Error during cleanup:", error)
    throw error
  }
}

// DELETE method handler for manual cleanup
export async function DELETE(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action")

  if (action === "cleanup") {
    // Basic authentication: Check for a debug token
    const debugToken = req.headers.get("X-Debug-Token") || req.nextUrl.searchParams.get("debug_token")
    if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
      const result = await manualBlogCleanup()

      return NextResponse.json(
        {
          message: "Blog cleanup completed successfully",
          ...result,
        },
        { status: 200 },
      )
    } catch (error) {
      console.error("Error during blog cleanup:", error)
      return NextResponse.json(
        {
          message: "Failed to cleanup blog posts",
          error: error.message,
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 })
}

export async function POST(req: NextRequest) {}
