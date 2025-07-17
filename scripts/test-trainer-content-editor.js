// Test script for trainer content editor functionality
console.log("🧪 Testing Trainer Content Editor Functionality")
console.log("=".repeat(50))

// Test configuration
const TEST_TRAINER_ID = "POj2MRZ5ZRbq3CW1U0zJ"
const BASE_URL = "http://localhost:3000"

// Helper function to make API requests
async function makeRequest(url, options = {}) {
  try {
    console.log(`📡 Making request to: ${url}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    console.log(`📊 Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`❌ Request failed:`, error.message)
    return { success: false, error: error.message }
  }
}

// Test 1: Fetch trainer content
async function testFetchContent() {
  console.log("\n🔍 Test 1: Fetching trainer content...")

  const result = await makeRequest(`${BASE_URL}/api/trainer/content/${TEST_TRAINER_ID}`)

  if (result.success) {
    console.log("✅ Successfully fetched trainer content")
    console.log("📋 Content structure:", Object.keys(result.data))

    if (result.data.content) {
      console.log("📝 Content sections:", Object.keys(result.data.content))
    }

    return result.data
  } else {
    console.log("❌ Failed to fetch trainer content")
    console.log("🔍 Possible issues:")
    console.log("  - API endpoints not accessible")
    console.log("  - Database connection issues")
    console.log("  - Network connectivity problems")
    return null
  }
}

// Test 2: Update trainer content
async function testUpdateContent(originalContent) {
  console.log("\n✏️ Test 2: Updating trainer content...")

  if (!originalContent) {
    console.log("⏭️ Skipping update test - no original content")
    return false
  }

  // Create test update
  const testUpdate = {
    ...originalContent,
    content: {
      ...originalContent.content,
      about: {
        title: "Test About Section",
        content: "This is a test bio update from the automated test script.",
      },
      hero: {
        title: "Test Hero Title",
        subtitle: "Test subtitle",
        description: "Test hero description",
      },
    },
    lastUpdated: new Date().toISOString(),
  }

  const result = await makeRequest(`${BASE_URL}/api/trainer/content/${TEST_TRAINER_ID}`, {
    method: "PUT",
    body: JSON.stringify(testUpdate),
  })

  if (result.success) {
    console.log("✅ Successfully updated trainer content")
    return true
  } else {
    console.log("❌ Failed to update trainer content")
    return false
  }
}

// Test 3: Verify persistence
async function testPersistence() {
  console.log("\n🔄 Test 3: Verifying content persistence...")

  const result = await makeRequest(`${BASE_URL}/api/trainer/content/${TEST_TRAINER_ID}`)

  if (result.success) {
    const content = result.data.content
    if (content?.about?.content?.includes("test bio update")) {
      console.log("✅ Content changes persisted successfully")
      return true
    } else {
      console.log("❌ Content changes not found in database")
      return false
    }
  } else {
    console.log("❌ Failed to verify persistence")
    return false
  }
}

// Test 4: Error handling
async function testErrorHandling() {
  console.log("\n🚨 Test 4: Testing error handling...")

  // Test with invalid trainer ID
  const invalidResult = await makeRequest(`${BASE_URL}/api/trainer/content/invalid-id`)

  if (!invalidResult.success) {
    console.log("✅ Properly handles invalid trainer ID")
  } else {
    console.log("⚠️ Should have failed with invalid trainer ID")
  }

  // Test with malformed data
  const malformedResult = await makeRequest(`${BASE_URL}/api/trainer/content/${TEST_TRAINER_ID}`, {
    method: "PUT",
    body: JSON.stringify({ invalid: "data structure" }),
  })

  if (!malformedResult.success) {
    console.log("✅ Properly handles malformed data")
  } else {
    console.log("⚠️ Should have failed with malformed data")
  }
}

// Run all tests
async function runAllTests() {
  try {
    console.log("🚀 Starting trainer content editor tests...")

    const originalContent = await testFetchContent()
    const updateSuccess = await testUpdateContent(originalContent)

    if (updateSuccess) {
      await testPersistence()
    }

    await testErrorHandling()

    console.log("\n📊 Test Summary:")
    console.log("- Content fetching: " + (originalContent ? "✅ PASS" : "❌ FAIL"))
    console.log("- Content updating: " + (updateSuccess ? "✅ PASS" : "❌ FAIL"))
    console.log("- Error handling: ✅ TESTED")
  } catch (error) {
    console.error("💥 Test failed with error:", error.message)
  }
}

// Execute tests
runAllTests()
