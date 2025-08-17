const POSTS_TO_DELETE = [
  "weightlifting-also-known-as-strength-or-resistanc-1755457007047",
  "weightlifting-also-known-as-strength-or-resistanc-1755457494721",
  "weightlifting-also-known-as-strength-or-resistanc-1755458136434",
  "weightlifting-also-known-as-strength-or-resistanc-1755458535833",
  "weightlifting-also-known-as-strength-or-resistanc-1755459377995",
]

async function deleteTestPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const debugToken = process.env.DEBUG_TOKEN

  console.log("Starting deletion of test blog posts...")

  for (const slug of POSTS_TO_DELETE) {
    try {
      console.log(`Deleting post: ${slug}`)

      const response = await fetch(`${baseUrl}/api/blog-post/${slug}`, {
        method: "DELETE",
        headers: {
          "X-Debug-Token": debugToken,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (response.ok) {
        console.log(`✅ Successfully deleted: ${slug}`)
        console.log(`   Deleted file: ${result.deletedFile}`)
      } else {
        console.log(`❌ Failed to delete ${slug}: ${result.message}`)
      }

      // Small delay between deletions
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`❌ Error deleting ${slug}:`, error.message)
    }
  }

  console.log("Deletion process completed!")
}

// Run the deletion
deleteTestPosts().catch(console.error)
