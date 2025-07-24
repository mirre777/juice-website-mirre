// Debug script to check blob permissions and access issues
const { list, head } = require("@vercel/blob")

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const BLOG_CONTENT_PATH = "blog/"

async function debugBlobPermissions() {
  console.log("🔐 DEBUG: Blob Permissions and Access Analysis")
  console.log("=".repeat(60))

  console.log("📋 Environment Check:")
  console.log(`BLOB_READ_WRITE_TOKEN: ${BLOB_TOKEN ? "✅ SET" : "❌ NOT SET"}`)

  if (BLOB_TOKEN) {
    console.log(`Token length: ${BLOB_TOKEN.length} characters`)
    console.log(`Token starts with: ${BLOB_TOKEN.substring(0, 10)}...`)
  }
  console.log("")

  if (!BLOB_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN is not set.")
    return
  }

  try {
    // List blobs with detailed info
    console.log("📁 Listing blobs with detailed permissions...")
    const { blobs } = await list({ token: BLOB_TOKEN })

    console.log(`Found ${blobs.length} total blobs`)

    const blogBlobs = blobs.filter((blob) => blob.pathname.startsWith(BLOG_CONTENT_PATH))
    console.log(`Found ${blogBlobs.length} blog blobs`)

    for (const blob of blogBlobs) {
      console.log(`\n--- BLOB: ${blob.pathname} ---`)
      console.log(`Size: ${blob.size} bytes`)
      console.log(`URL: ${blob.url}`)
      console.log(`Upload date: ${blob.uploadedAt}`)

      // Test different access methods
      console.log("\n🔍 Testing access methods:")

      // Method 1: Direct fetch with no additional headers
      try {
        console.log("1. Direct fetch (no headers)...")
        const response1 = await fetch(blob.url)
        console.log(`   Status: ${response1.status} ${response1.statusText}`)
        console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response1.headers.entries()))}`)

        if (response1.ok) {
          const content = await response1.text()
          console.log(`   ✅ SUCCESS: Content length: ${content.length}`)
          console.log(`   Preview: ${content.substring(0, 100)}...`)
        }
      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`)
      }

      // Method 2: Fetch with authorization header
      try {
        console.log("2. Fetch with authorization header...")
        const response2 = await fetch(blob.url, {
          headers: {
            Authorization: `Bearer ${BLOB_TOKEN}`,
          },
        })
        console.log(`   Status: ${response2.status} ${response2.statusText}`)

        if (response2.ok) {
          const content = await response2.text()
          console.log(`   ✅ SUCCESS: Content length: ${content.length}`)
        }
      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`)
      }

      // Method 3: Use Vercel Blob head function
      try {
        console.log("3. Using Vercel Blob head function...")
        const headResult = await head(blob.url, { token: BLOB_TOKEN })
        console.log(`   ✅ HEAD SUCCESS:`, headResult)
      } catch (error) {
        console.log(`   ❌ HEAD ERROR: ${error.message}`)
      }

      // Method 4: Check if URL is publicly accessible
      try {
        console.log("4. Testing public access (no token)...")
        const publicResponse = await fetch(blob.url, {
          method: "HEAD",
        })
        console.log(`   Status: ${publicResponse.status} ${publicResponse.statusText}`)
        console.log(`   Public access: ${publicResponse.ok ? "✅ ALLOWED" : "❌ FORBIDDEN"}`)
      } catch (error) {
        console.log(`   ❌ PUBLIC ACCESS ERROR: ${error.message}`)
      }

      console.log("\n" + "-".repeat(50))
    }

    // Test token validity
    console.log("\n🔑 Testing token validity...")
    try {
      const testList = await list({ token: BLOB_TOKEN, limit: 1 })
      console.log("✅ Token can list blobs successfully")
    } catch (error) {
      console.log(`❌ Token list error: ${error.message}`)
    }

    // Check if we need to use a different approach
    console.log("\n💡 RECOMMENDATIONS:")
    console.log("1. Check if blobs were uploaded as private vs public")
    console.log("2. Verify BLOB_READ_WRITE_TOKEN has read permissions")
    console.log("3. Consider using Vercel Blob SDK methods instead of direct fetch")
    console.log("4. Check if CORS settings are blocking access")
  } catch (error) {
    console.error("❌ Error during permissions analysis:", error)
    console.error("Stack trace:", error.stack)
  }
}

// Run the debug function
console.log("🚀 Starting blob permissions debug analysis...")
debugBlobPermissions()
  .then(() => {
    console.log("\n✅ Permissions debug analysis complete")
  })
  .catch((error) => {
    console.error("❌ Permissions debug script failed:", error)
    console.error("Stack trace:", error.stack)
  })
