// Test script to check if suspended blob storage allows read access
import { list, get } from "@vercel/blob"

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

    // Test 2: Try to read content from first file
    if (blobs.length > 0) {
      const firstBlob = blobs[0]
      console.log("3. Testing get() operation:")
      console.log(`   Attempting to read: ${firstBlob.pathname}`)

      try {
        const blobData = await get(firstBlob.url, { token })
        console.log(`   ✅ Get successful: Retrieved blob object`)
        console.log(`   Blob URL: ${blobData.url}`)
        console.log(`   Download URL: ${blobData.downloadUrl}`)

        // Test 3: Try to fetch actual content
        console.log("\n4. Testing content download:")
        const response = await fetch(blobData.downloadUrl)

        if (response.ok) {
          const content = await response.text()
          console.log(`   ✅ Content download successful`)
          console.log(`   Content length: ${content.length} characters`)
          console.log(`   First 100 characters: ${content.substring(0, 100)}...`)
        } else {
          console.log(`   ❌ Content download failed: ${response.status} ${response.statusText}`)
        }
      } catch (getError) {
        console.log(`   ❌ Get operation failed: ${getError.message}`)
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
