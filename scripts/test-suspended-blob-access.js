// Test script to check if suspended blob storage allows read access
import { list, head } from "@vercel/blob"

async function testSuspendedBlobAccess() {
  console.log("=== Testing Suspended Blob Storage Access ===\n")

  // Check environment variables
  const token = process.env.BLOB_READ_WRITE_TOKEN
  console.log("1. Environment Check:")
  console.log(`   Token available: ${token ? "YES" : "NO"}`)
  console.log(`   Token length: ${token ? token.length : 0} characters\n`)

  if (!token) {
    console.log("❌ No blob token available - cannot test")
    return
  }

  try {
    // Test 1: List blog files
    console.log("2. Testing list() operation:")
    const { blobs } = await list({ prefix: "blog/", token })
    console.log(`   ✅ List successful: Found ${blobs.length} files`)

    if (blobs.length > 0) {
      console.log("   Files found:")
      blobs.forEach((blob, index) => {
        console.log(`   ${index + 1}. ${blob.pathname} (${blob.size} bytes)`)
      })
    }
    console.log("")

    // Test 2: Try to get metadata from first file
    if (blobs.length > 0) {
      const firstBlob = blobs[0]
      console.log("3. Testing head() operation:")
      console.log(`   Attempting to get metadata: ${firstBlob.pathname}`)

      try {
        const blobData = await head(firstBlob.url, { token })
        console.log(`   ✅ Head successful: Retrieved blob metadata`)
        console.log(`   Blob URL: ${blobData.url}`)
        console.log(`   Download URL: ${blobData.downloadUrl}`)

        // Test 3: Try to fetch actual content
        console.log("\n4. Testing content download:")
        const response = await fetch(firstBlob.downloadUrl || blobData.downloadUrl)

        if (response.ok) {
          const content = await response.text()
          console.log(`   ✅ Content download successful`)
          console.log(`   Content length: ${content.length} characters`)
          console.log(`   First 100 characters: ${content.substring(0, 100)}...`)
        } else {
          console.log(`   ❌ Content download failed: ${response.status} ${response.statusText}`)
        }
      } catch (headError) {
        console.log(`   ❌ Head operation failed: ${headError.message}`)

        console.log("   Trying direct download fallback...")
        try {
          const response = await fetch(firstBlob.downloadUrl)
          if (response.ok) {
            const content = await response.text()
            console.log(`   ✅ Direct download successful`)
            console.log(`   Content length: ${content.length} characters`)
            console.log(`   First 100 characters: ${content.substring(0, 100)}...`)
          } else {
            console.log(`   ❌ Direct download also failed: ${response.status} ${response.statusText}`)
          }
        } catch (downloadError) {
          console.log(`   ❌ Direct download error: ${downloadError.message}`)
        }
      }
    }
  } catch (listError) {
    console.log(`   ❌ List operation failed: ${listError.message}`)
    console.log(`   Error details: ${listError.stack}`)
  }

  console.log("\n=== Test Complete ===")
}

// Run the test
testSuspendedBlobAccess().catch(console.error)
