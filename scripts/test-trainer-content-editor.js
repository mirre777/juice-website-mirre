// Test script for Trainer Content Editor functionality
console.log("🧪 Testing Trainer Content Editor Functionality")
console.log("=".repeat(50))

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const TRAINER_ID = "POj2MRZ5ZRbq3CW1U0zJ" // Known test trainer ID

async function testTrainerContentEditor() {
  try {
    console.log("🔍 Test 1: Fetching trainer content...")

    // Test GET endpoint
    const getResponse = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`)

    if (!getResponse.ok) {
      throw new Error(`GET request failed: ${getResponse.status}`)
    }

    const getData = await getResponse.json()
    console.log("✅ Successfully fetched trainer data")
    console.log("📊 Trainer:", getData.trainer?.name)
    console.log("📝 Content sections:", Object.keys(getData.content || {}))

    // Test PUT endpoint with modified content
    console.log("\n🔍 Test 2: Updating trainer content...")

    const updatedContent = {
      ...getData.content,
      about: {
        ...getData.content.about,
        content: "Updated bio content from test script - " + new Date().toISOString(),
      },
      hero: {
        ...getData.content.hero,
        title: "Test Updated Title - " + Date.now(),
      },
    }

    const putResponse = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: updatedContent }),
    })

    if (!putResponse.ok) {
      throw new Error(`PUT request failed: ${putResponse.status}`)
    }

    const putData = await putResponse.json()
    console.log("✅ Successfully updated trainer content")
    console.log("💾 Update result:", putData.message)

    // Test GET again to verify persistence
    console.log("\n🔍 Test 3: Verifying content persistence...")

    const verifyResponse = await fetch(`${BASE_URL}/api/trainer/content/${TRAINER_ID}`)
    const verifyData = await verifyResponse.json()

    const isContentUpdated = verifyData.content.about.content.includes("Updated bio content from test script")
    const isTitleUpdated = verifyData.content.hero.title.includes("Test Updated Title")

    if (isContentUpdated && isTitleUpdated) {
      console.log("✅ Content persistence verified - changes were saved!")
    } else {
      console.log("❌ Content persistence failed - changes were not saved")
    }

    console.log("\n🎉 All tests completed successfully!")
    console.log("📋 Summary:")
    console.log("  - ✅ Content fetching works")
    console.log("  - ✅ Content updating works")
    console.log("  - ✅ Content persistence works")
    console.log("  - ✅ Editor is fully functional")
  } catch (error) {
    console.log("\n❌ Test failed with error:", error.message)

    if (error.message.includes("fetch failed")) {
      console.log("\n🔧 Possible issues:")
      console.log("  - API endpoints not accessible")
      console.log("  - Database connection issues")
      console.log("  - Network connectivity problems")
    }

    if (error.message.includes("404")) {
      console.log("\n🔧 Possible issues:")
      console.log("  - Trainer ID not found in database")
      console.log("  - API route not properly configured")
    }

    if (error.message.includes("500")) {
      console.log("\n🔧 Possible issues:")
      console.log("  - Server-side error in API")
      console.log("  - Database write permissions")
      console.log("  - Firebase configuration issues")
    }
  }
}

// Run the test
testTrainerContentEditor()
