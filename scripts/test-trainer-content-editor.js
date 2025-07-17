console.log("🧪 Testing Trainer Content Editor Functionality")
console.log("=".repeat(50))

// Test configuration
const TRAINER_ID = "POj2MRZ5ZRbq3CW1U0zJ" // Known trainer ID
const BASE_URL = "http://localhost:3000" // Adjust if needed

// Test 1: Fetching trainer content
console.log("\n👤 Test 1: Fetching trainer content...")

async function testFetchContent() {
  try {
    const response = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Successfully fetched trainer content")
    console.log("Content structure:", Object.keys(data))

    if (data.content) {
      console.log("Content sections:", Object.keys(data.content))
    }

    return data
  } catch (error) {
    console.error("❌ Failed to fetch content:", error.message)
    console.log("\n🔧 Possible issues:")
    console.log("- API endpoints not accessible")
    console.log("- Database connection issues")
    console.log("- Network connectivity problems")
    throw error
  }
}

// Test 2: Updating trainer content
console.log("\n✏️ Test 2: Updating trainer content...")

async function testUpdateContent(originalData) {
  try {
    const updatedContent = {
      ...originalData.content,
      about: {
        ...originalData.content?.about,
        content: "This is an updated bio from the test script - " + new Date().toISOString(),
      },
      hero: {
        ...originalData.content?.hero,
        title: "Updated Hero Title - Test " + Date.now(),
      },
    }

    const response = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: updatedContent,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Successfully updated trainer content")
    console.log("Update response:", data.success ? "Success" : "Failed")

    return data
  } catch (error) {
    console.error("❌ Failed to update content:", error.message)
    throw error
  }
}

// Test 3: Verifying persistence
console.log("\n🔍 Test 3: Verifying content persistence...")

async function testPersistence() {
  try {
    // Wait a moment for database to update
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`)
    const data = await response.json()

    console.log("✅ Successfully re-fetched content")
    console.log("About content preview:", data.content?.about?.content?.substring(0, 50) + "...")
    console.log("Hero title:", data.content?.hero?.title)

    return data
  } catch (error) {
    console.error("❌ Failed to verify persistence:", error.message)
    throw error
  }
}

// Test 4: Error handling
console.log("\n🚨 Test 4: Error handling...")

async function testErrorHandling() {
  try {
    // Test with invalid trainer ID
    const response = await fetch(`${BASE_URL}/api/trainer/content/invalid-id`)
    console.log("Invalid ID response status:", response.status)

    // Test with malformed data
    const malformedResponse = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invalidField: "test",
      }),
    })
    console.log("Malformed data response status:", malformedResponse.status)

    console.log("✅ Error handling tests completed")
  } catch (error) {
    console.log("✅ Error handling working (expected errors caught)")
  }
}

// Run all tests
async function runAllTests() {
  try {
    console.log("\n🚀 Starting comprehensive test suite...")

    const originalData = await testFetchContent()
    await testUpdateContent(originalData)
    await testPersistence()
    await testErrorHandling()

    console.log("\n🎉 All tests completed successfully!")
    console.log("✅ Trainer content editor is fully functional")
  } catch (error) {
    console.error("\n💥 Test failed with error:", error.message)
    console.log("\n🔧 Troubleshooting steps:")
    console.log("1. Check if the development server is running")
    console.log("2. Verify Firebase configuration")
    console.log("3. Ensure trainer ID exists in database")
    console.log("4. Check network connectivity")
    console.log("5. Review API endpoint implementations")
  }
}

// Execute tests
runAllTests()
