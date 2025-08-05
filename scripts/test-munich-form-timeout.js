// Test Munich form with timeout handling
console.log("⏰ Munich Form Timeout Test")
console.log("===========================")

async function testWithTimeout(testFunction, timeoutMs = 10000) {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Test timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    try {
      const result = await testFunction()
      clearTimeout(timeoutId)
      resolve(result)
    } catch (error) {
      clearTimeout(timeoutId)
      reject(error)
    }
  })
}

async function testMunichFormSubmission() {
  console.log("🧪 Testing Munich form submission with timeout...")

  const formData = new FormData()
  formData.append("email", "timeout-test@example.com")
  formData.append("city", "München")
  formData.append("phone", "+49 89 12345678")
  formData.append("plan", "personal-training-munich")
  formData.append("user_type", "client")
  formData.append("name", "Timeout Test User")
  formData.append("goal", "muskelaufbau")
  formData.append("district", "Maxvorstadt")
  formData.append("startTime", "sofort")
  formData.append("message", "Testing timeout behavior")

  try {
    const result = await testWithTimeout(async () => {
      const response = await fetch("/api/test-waitlist", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    }, 15000) // 15 second timeout

    console.log("✅ Form submission successful:", result)
    return result
  } catch (error) {
    if (error.message.includes("timed out")) {
      console.error("⏰ Form submission timed out!")
      console.log("This suggests the server action is hanging")
    } else {
      console.error("❌ Form submission failed:", error)
    }
    throw error
  }
}

async function testFirebaseDirectly() {
  console.log("🔥 Testing Firebase directly...")

  try {
    const result = await testWithTimeout(async () => {
      const response = await fetch("/api/debug-firestore")
      return await response.json()
    }, 5000)

    console.log("✅ Firebase test result:", result)
    return result
  } catch (error) {
    console.error("❌ Firebase test failed:", error)
    throw error
  }
}

async function runTimeoutTests() {
  console.log("🚀 Starting timeout tests...\n")

  try {
    // Test Firebase first
    await testFirebaseDirectly()

    // Then test form submission
    await testMunichFormSubmission()

    console.log("\n✅ All timeout tests passed!")
  } catch (error) {
    console.error("\n❌ Timeout tests failed:", error)

    // Provide debugging suggestions
    console.log("\n🔍 Debugging suggestions:")
    console.log("1. Check if Firebase is properly configured")
    console.log("2. Check if server actions are working")
    console.log("3. Check network connectivity")
    console.log("4. Check Vercel function timeout limits")
  }
}

// Run the tests
runTimeoutTests()
