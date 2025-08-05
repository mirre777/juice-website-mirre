// Simple Munich form test - copy and paste this entire script into browser console
// Make sure you're on the /personal-training-muenchen page first

console.log("🧪 Simple Munich Form Test Starting...")

async function quickMunichTest() {
  try {
    console.log("📍 Current page:", window.location.pathname)

    // Test 1: Quick API test
    console.log("\n1. Testing debug API...")
    const apiResponse = await fetch("/api/debug-munich-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (apiResponse.ok) {
      const apiResult = await apiResponse.json()
      console.log("✅ API test result:", apiResult)
    } else {
      console.log("❌ API test failed:", apiResponse.status)
    }

    // Test 2: Form data test
    console.log("\n2. Testing form submission...")
    const formData = new FormData()
    formData.append("email", "quicktest@example.com")
    formData.append("name", "Quick Test")
    formData.append("city", "München")
    formData.append("goal", "muskelaufbau")
    formData.append("district", "Maxvorstadt")
    formData.append("startTime", "sofort")
    formData.append("user_type", "client")
    formData.append("plan", "personal-training-munich")
    formData.append("phone", "+49 89 12345678")
    formData.append("message", "Quick test message")

    console.log("📝 Form data prepared, testing submission...")

    // Test with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      console.log("⏰ Test timed out after 10 seconds")
    }, 10000)

    const startTime = Date.now()

    const response = await fetch("/api/test-waitlist", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`⏱️ Request completed in ${duration}ms`)
    console.log("📡 Response status:", response.status)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Form submission successful:", result)
    } else {
      const errorText = await response.text()
      console.log("❌ Form submission failed:", errorText)
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("⏰ Request was aborted due to timeout - this indicates the server action is hanging")
    } else {
      console.error("❌ Test failed with error:", error)
    }
  }
}

// Test Firebase directly
async function testFirebaseDirect() {
  console.log("\n3. Testing Firebase directly...")

  try {
    const response = await fetch("/api/debug-waitlist-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "firebase-test@example.com",
        name: "Firebase Test",
        city: "München",
        goal: "abnehmen",
        district: "Schwabing",
        startTime: "1-2-wochen",
        user_type: "client",
        plan: "personal-training-munich",
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Firebase test successful:", result)
    } else {
      const errorText = await response.text()
      console.log("❌ Firebase test failed:", errorText)
    }
  } catch (error) {
    console.error("❌ Firebase test error:", error)
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Running all Munich form tests...")
  console.log("=====================================")

  await quickMunichTest()
  await testFirebaseDirect()

  console.log("\n✨ All tests completed!")
  console.log("\n📋 Summary:")
  console.log("- Check above for any timeout messages")
  console.log("- Look for error messages in red")
  console.log("- If tests pass but form still hangs, the issue is in the React component")
}

// Execute immediately
runAllTests()
