// Simple Munich form test - run in browser console
console.log("🧪 Simple Munich Form Test")
console.log("==========================")

async function simpleMunichTest() {
  try {
    console.log("🔍 Testing Munich form submission...")

    // Create simple test data
    const formData = new FormData()
    formData.append("email", "simple-test@example.com")
    formData.append("name", "Simple Test")
    formData.append("city", "München")
    formData.append("goal", "muskelaufbau")
    formData.append("district", "Maxvorstadt")
    formData.append("startTime", "sofort")
    formData.append("user_type", "client")
    formData.append("plan", "personal-training-munich")

    console.log("📝 Form data prepared")

    // Test with a 10-second timeout
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10000)

    console.log("📡 Sending request...")
    const startTime = Date.now()

    const response = await fetch("/api/test-waitlist", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })

    const endTime = Date.now()
    console.log(`⏱️ Request completed in ${endTime - startTime}ms`)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Success:", result)
    } else {
      console.log("❌ Failed:", response.status, response.statusText)
      const errorText = await response.text()
      console.log("Error details:", errorText)
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("⏰ Request timed out - this indicates the server action is hanging")
    } else {
      console.error("❌ Error:", error)
    }
  }
}

// Run the test
simpleMunichTest()
