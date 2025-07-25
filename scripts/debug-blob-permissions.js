const { list } = require("@vercel/blob")

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

async function debugBlobPermissions() {
  console.log("🚀 Starting blob permissions debug analysis...")
  console.log("📊 DEBUG: Blob Permissions and Access Analysis")
  console.log("=".repeat(50))

  // Check environment variables
  console.log("📋 Environment Check:")
  console.log(`BLOB_READ_WRITE_TOKEN: ${BLOB_TOKEN ? "✅ SET" : "❌ NOT SET"}`)

  if (!BLOB_TOKEN) {
    console.log("❌ BLOB_READ_WRITE_TOKEN is not set.")
    console.log("✅ Permissions debug analysis complete")
    return
  }

  try {
    // Test basic blob listing
    console.log("\n🔍 Testing blob listing permissions...")
    const { blobs } = await list({ token: BLOB_TOKEN })
    console.log(`✅ Successfully listed ${blobs.length} blobs`)

    // Test specific blog content access
    const blogBlobs = blobs.filter((blob) => blob.pathname.startsWith("blog/"))
    console.log(`📝 Found ${blogBlobs.length} blog-related blobs`)

    if (blogBlobs.length > 0) {
      console.log("\n🧪 Testing content access for each blob...")

      for (const blob of blogBlobs.slice(0, 3)) {
        // Test first 3 blobs
        console.log(`\n--- Testing: ${blob.pathname} ---`)
        console.log(`Size: ${blob.size} bytes`)
        console.log(`URL: ${blob.url}`)

        try {
          const response = await fetch(blob.url)
          console.log(`Status: ${response.status} ${response.statusText}`)

          if (response.ok) {
            const content = await response.text()
            console.log(`✅ Successfully fetched ${content.length} characters`)
          } else {
            console.log(`❌ Failed to fetch: ${response.status}`)

            // Try with different authentication methods
            console.log("🔄 Trying with Authorization header...")
            const authResponse = await fetch(blob.url, {
              headers: {
                Authorization: `Bearer ${BLOB_TOKEN}`,
              },
            })
            console.log(`Auth attempt status: ${authResponse.status}`)
          }
        } catch (error) {
          console.log(`❌ Fetch error: ${error.message}`)
        }
      }
    }
  } catch (error) {
    console.error("❌ Error during permissions analysis:", error)
  }

  console.log("\n✅ Permissions debug analysis complete")
}

// Run the debug function
debugBlobPermissions()
  .then(() => {
    console.log("Debug complete")
  })
  .catch((error) => {
    console.error("Debug failed:", error)
  })
