console.log("🚀 Running Munich Debug Script")
console.log("==============================")

// This script should be run in the browser console on the Munich page
// Copy and paste this into the browser console while on /personal-training-muenchen

async function quickDebugTest() {
  console.log("🔍 Quick debug test starting...")

  try {
    // Test the debug API endpoint
    console.log("1. Testing debug API...")
    const debugResponse = await fetch("/api/debug-munich-form", {
      method: "POST",
      body: new FormData(), // Empty form data for basic test
    })

    const debugResult = await debugResponse.json()
    console.log("Debug API result:", debugResult)

    if (debugResult.success) {
      console.log("✅ Debug API working")
    } else {
      console.log("❌ Debug API failed:", debugResult.error)
    }

    // Test the actual form submission
    console.log("2. Testing actual form submission...")
    const testForm = new FormData()
    testForm.append("email", "debug@test.com")
    testForm.append("name", "Debug User")
    testForm.append("city", "München")
    testForm.append("goal", "muskelaufbau")
    testForm.append("district", "Maxvorstadt")
    testForm.append("startTime", "sofort")
    testForm.append("user_type", "client")
    testForm.append("plan", "personal-training-munich")

    const formResponse = await fetch("/api/test-waitlist", {
      method: "POST",
      body: testForm,
    })

    const formResult = await formResponse.json()
    console.log("Form submission result:", formResult)
  } catch (error) {
    console.error("❌ Quick debug test failed:", error)
  }
}

// Run the test
quickDebugTest()
