// Script to update the "myths" category to "Science"
// This will run once to update the blog post category

const ADMIN_API_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/blog-posts`
  : "http://localhost:3000/api/admin/blog-posts"

async function updateMythsCategory() {
  try {
    console.log("Fetching all blog posts...")

    // Fetch all posts
    const response = await fetch(`${ADMIN_API_URL}?t=${Date.now()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Found ${data.totalPosts} total posts`)

    // Find posts with "myths" category
    const mythsPosts = data.posts.filter(
      (post: any) => post.category.toLowerCase() === "myths" && post.source === "blob",
    )

    console.log(`Found ${mythsPosts.length} post(s) with "myths" category`)

    if (mythsPosts.length === 0) {
      console.log('No posts with "myths" category found. Nothing to update.')
      return
    }

    // Update each myths post to Science
    for (const post of mythsPosts) {
      console.log(`Updating post: ${post.title} (${post.slug})`)

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

      if (!updateResponse.ok) {
        throw new Error(`Failed to update post ${post.slug}: ${updateResponse.status}`)
      }

      console.log(`✓ Successfully updated ${post.slug} to Science category`)
    }

    console.log("\n✓ All posts updated successfully!")
    console.log('The "myths" category has been replaced with "Science"')
  } catch (error) {
    console.error("Error updating categories:", error)
    throw error
  }
}

// Run the update
updateMythsCategory()
