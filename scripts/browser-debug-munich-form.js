// Browser-compatible Munich form debug script
// Run this in the browser console on /personal-training-muenchen

console.log("🔍 Munich Form Browser Debug Script")
console.log("===================================")

async function debugMunichFormInBrowser() {
  console.log("🚀 Starting browser debug tests...")

  try {
    // Test 1: Check if we're on the right page
    console.log("1. Checking current page...")
    console.log("Current URL:", window.location.href)
    console.log("Page title:", document.title)

    // Test 2: Check if form exists
    console.log("\n2. Checking form elements...")
    const form = document.querySelector("form")
    if (form) {
      console.log("✅ Form found")
      const inputs = form.querySelectorAll("input, select, textarea")
      console.log(`📝 Found ${inputs.length} form inputs`)
    } else {
      console.log("❌ No form found on page")
    }

    // Test 3: Test debug API endpoint
    console.log("\n3. Testing debug API endpoint...")
    const debugResponse = await fetch("/api/debug-munich-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Debug API status:", debugResponse.status)

    if (debugResponse.ok) {
      const debugResult = await debugResponse.json()
      console.log("✅ Debug API result:", debugResult)

      if (debugResult.success) {
        console.log(`⏱️ Form submission took ${debugResult.duration}ms`)
      } else {
        console.log("❌ Debug API failed:", debugResult.error)
      }
    } else {
      const errorText = await debugResponse.text()
      console.log("❌ Debug API error:", errorText)
    }

    // Test 4: Test actual form submission with timeout
    console.log("\n4. Testing actual form submission...")
    await testFormSubmissionWithTimeout()
  } catch (error) {
    console.error("❌ Browser debug failed:", error)
  }
}

async function testFormSubmissionWithTimeout() {
  const timeoutMs = 15000 // 15 seconds

  console.log(`⏰ Testing form submission with ${timeoutMs}ms timeout...`)

  const testFormData = new FormData()
  testFormData.append("email", "browser-test@example.com")
  testFormData.append("name", "Browser Test User")
  testFormData.append("city", "München")
  testFormData.append("goal", "abnehmen")
  testFormData.append("district", "Schwabing")
  testFormData.append("startTime", "1-2-wochen")
  testFormData.append("user_type", "client")
  testFormData.append("plan", "personal-training-munich")
  testFormData.append("phone", "+49 89 87654321")
  testFormData.append("message", "Browser timeout test")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
    console.log("⏰ Request timed out after", timeoutMs, "ms")
  }, timeoutMs)

  try {
    const startTime = performance.now()

    const response = await fetch("/api/test-waitlist", {
      method: "POST",
      body: testFormData,
      signal: controller.signal,
    })

    const endTime = performance.now()
    const duration = endTime - startTime

    clearTimeout(timeoutId)

    console.log(`📡 Response received in ${duration.toFixed(2)}ms`)
    console.log("Response status:", response.status)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Form submission successful:", result)
    } else {
      const errorText = await response.text()
      console.log("❌ Form submission failed:", errorText)
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      console.log("⏰ Form submission was aborted due to timeout")
      console.log("🔍 This suggests the server action is hanging")
    } else {
      console.error("❌ Form submission error:", error)
    }
  }
}

// Test Firebase connection
async function testFirebaseInBrowser() {
  console.log("\n5. Testing Firebase connection...")

  try {
    const response = await fetch("/api/debug-firestore")
    const result = await response.json()

    console.log("🔥 Firebase test result:", result)

    if (result.hasRealConfig) {
      console.log("✅ Real Firebase config detected")
    } else {
      console.log("⚠️ Using mock Firebase config")
    }
  } catch (error) {
    console.error("❌ Firebase test failed:", error)
  }
}

// Main execution
async function runBrowserDebug() {
  await debugMunichFormInBrowser()
  await testFirebaseInBrowser()

  console.log("\n✨ Browser debug completed!")
  console.log("\n🔍 Next steps:")
  console.log("1. Check if any requests timed out")
  console.log("2. Look for errors in the Network tab")
  console.log("3. Check Vercel function logs")
  console.log("4. Try submitting the actual form to see if it hangs")
}

// Auto-run if in browser
if (typeof window !== "undefined") {
  runBrowserDebug()
} else {
  console.log("This script should be run in the browser console")
}
