// Script to update the "myths" category to "Science"
// This will run once to update the blog post category

const ADMIN_API_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/blog-posts`
  : "http://localhost:3000/api/admin/blog-posts"

async function updateMythsCategory() {
  try {
    console.log("=== Starting Category Update Script ===")
    console.log(`API URL: ${ADMIN_API_URL}`)
    console.log("Fetching all blog posts...")

    // Fetch all posts
    const response = await fetch(`${ADMIN_API_URL}?t=${Date.now()}`)
    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch posts: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`Found ${data.totalPosts} total posts`)
    console.log(`Blob posts: ${data.blobPosts}, Hardcoded posts: ${data.hardcodedPosts}`)

    // Find posts with "myths" category
    const mythsPosts = data.posts.filter(
      (post: any) => post.category.toLowerCase() === "myths" && post.source === "blob",
    )

    console.log(`\nFound ${mythsPosts.length} post(s) with "myths" category:`)
    mythsPosts.forEach((post: any) => {
      console.log(`  - ${post.title} (slug: ${post.slug})`)
    })

    if (mythsPosts.length === 0) {
      console.log('\nNo posts with "myths" category found.')
      console.log("Available categories:", [...new Set(data.posts.map((p: any) => p.category))].sort())
      return
    }

    // Update each myths post to Science
    for (const post of mythsPosts) {
      console.log(`\nUpdating post: ${post.title}`)
      console.log(`  Slug: ${post.slug}`)
      console.log(`  Current category: ${post.category}`)

      const updateResponse = await fetch(ADMIN_API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: post.slug,
          category: "Science",
        }),
      })

      console.log(`  Update response status: ${updateResponse.status}`)

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        throw new Error(`Failed to update post ${post.slug}: ${updateResponse.status} - ${errorText}`)
      }

      const result = await updateResponse.json()
      console.log(`  ✓ ${result.message}`)
    }

    console.log("\n=== Update Complete ===")
    console.log(`✓ Successfully updated ${mythsPosts.length} post(s)`)
    console.log('The "myths" category has been replaced with "Science"')
    console.log("\nRefresh the admin page to see the updated category in the dropdown.")
  } catch (error) {
    console.error("\n=== Error ===")
    console.error("Failed to update categories:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw error
  }
}

// Run the update
updateMythsCategory()
