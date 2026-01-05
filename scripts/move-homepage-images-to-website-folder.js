import { put, del, list } from "@vercel/blob"

const BLOB_STORAGE_BASE = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com"

// Get token from environment
const token = process.env.BLOB_READ_WRITE_TOKEN

if (!token) {
  console.error("[Migration] Error: BLOB_READ_WRITE_TOKEN environment variable is not set")
  console.error("[Migration] Please set it before running this script:")
  console.error("[Migration]   export BLOB_READ_WRITE_TOKEN='your-token-here'")
  console.error("[Migration]   node scripts/move-homepage-images-to-website-folder.js")
  process.exit(1)
}

// Images that need to be moved to website-images/ folder
const imagesToMove = [
  {
    currentUrl: `${BLOB_STORAGE_BASE}/Screenshot-MacBook%20Pro%20%2816inch%29.png`,
    filename: "Screenshot-MacBook Pro (16inch).png",
    description: "Get More Clients image",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/Blue%201.png`,
    filename: "Blue 1.png",
    description: "Keep Clients Engaged image",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/gym_outside_kate.png`,
    filename: "gym_outside_kate.png",
    description: "Kate trainer profile",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/jackie%20copy.png`,
    filename: "jackie copy.png",
    description: "Jackie trainer profile",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/max88.png`,
    filename: "max88.png",
    description: "Max trainer profile",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/jonne%20trainer.png`,
    filename: "jonne trainer.png",
    description: "Jonne trainer profile/testimonial",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/jonas%20ericsson.jpg`,
    filename: "jonas ericsson.jpg",
    description: "Jonas Ericsson testimonial",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/Screenshot%202025-12-14%20at%2017.31.17.png`,
    filename: "Screenshot 2025-12-14 at 17.31.17.png",
    description: "Alex Fliger testimonial",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/trainer%20showing%20a%20client%20something.png`,
    filename: "trainer showing a client something.png",
    description: "Sara Grünberg client testimonial",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/Juice_Fitness_two_people_talking_to_each_other_at_the_gym_blu_ea5b76bc-01e6-4498-87f5-1cfe18622f49_1.png`,
    filename: "Juice_Fitness_two_people_talking_to_each_other_at_the_gym_blu_ea5b76bc-01e6-4498-87f5-1cfe18622f49_1.png",
    description: "Marcus Jonuis client testimonial",
  },
  {
    currentUrl: `${BLOB_STORAGE_BASE}/Screenshot%202025-12-14%20at%2015.17.32.png`,
    filename: "Screenshot 2025-12-14 at 15.17.32.png",
    description: "Maartje Verbeek client testimonial",
  },
]

async function moveHomepageImages() {
  try {
    console.log("[Migration] Starting homepage image migration to website-images/ folder...")
    console.log(`[Migration] Moving ${imagesToMove.length} images\n`)

    let successCount = 0
    let errorCount = 0
    const errors = []

    for (const image of imagesToMove) {
      try {
        console.log(`[Migration] Processing: ${image.description}`)
        console.log(`[Migration]   Current URL: ${image.currentUrl}`)

        // Fetch the image from current location
        const response = await fetch(image.currentUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        }

        // Get the image data as array buffer
        const imageData = await response.arrayBuffer()
        const contentType = response.headers.get("content-type") || "image/png"

        // Determine the new path
        const newPath = `website-images/${image.filename}`
        console.log(`[Migration]   New path: ${newPath}`)

        // Upload to new location
        const blob = await put(newPath, imageData, {
          access: "public",
          contentType: contentType,
          allowOverwrite: true, // Allow overwriting if file already exists
          token: token,
        })

        console.log(`[Migration]   ✓ Uploaded to: ${blob.url}`)

        // Try to find and delete the old file
        // First, list all blobs to find the old one
        const { blobs } = await list({ token })
        const oldBlob = blobs.find((b) => b.url === image.currentUrl)

        if (oldBlob) {
          try {
            await del(oldBlob.url, { token })
            console.log(`[Migration]   ✓ Deleted old file: ${oldBlob.pathname}`)
          } catch (deleteError) {
            console.log(`[Migration]   ⚠ Could not delete old file (may already be deleted): ${deleteError.message}`)
          }
        } else {
          console.log(`[Migration]   ⚠ Old file not found in blob list (may already be deleted)`)
        }

        successCount++
        console.log(`[Migration]   ✓ Successfully moved: ${image.description}\n`)
      } catch (error) {
        errorCount++
        const errorMsg = `Error moving ${image.description}: ${error instanceof Error ? error.message : "Unknown error"}`
        errors.push(errorMsg)
        console.error(`[Migration]   ✗ ${errorMsg}\n`)
      }
    }

    console.log(`[Migration] Migration complete!`)
    console.log(`[Migration]   Success: ${successCount}/${imagesToMove.length}`)
    console.log(`[Migration]   Errors: ${errorCount}/${imagesToMove.length}`)

    if (errors.length > 0) {
      console.log(`[Migration] Errors encountered:`)
      errors.forEach((error) => console.log(`[Migration]   - ${error}`))
    }

    // Verify by listing files in website-images/
    console.log(`\n[Migration] Verifying files in website-images/ folder...`)
    const { blobs } = await list({ prefix: "website-images/", token })
    console.log(`[Migration] Found ${blobs.length} files in website-images/ folder:`)
    blobs.forEach((blob) => {
      console.log(`[Migration]   - ${blob.pathname}`)
    })
  } catch (error) {
    console.error("[Migration] Fatal error during migration:", error)
    process.exit(1)
  }
}

moveHomepageImages()

