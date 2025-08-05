// Debug script for Munich form submission issues
console.log("🔍 Munich Form Submission Debug Script")
console.log("=====================================")

// Test the form submission flow
async function debugMunichFormSubmission() {
  console.log("\n1. Testing Munich form submission flow...")

  try {
    // Test data that matches what we see in the console
    const testFormData = new FormData()
    testFormData.append("email", "ggggggg@gmail.com")
    testFormData.append("city", "München")
    testFormData.append("phone", "+436602101427")
    testFormData.append("plan", "personal-training-munich")
    testFormData.append("user_type", "client")
    testFormData.append("name", "Mirre Snelting")
    testFormData.append("goal", "abnehmen")
    testFormData.append("district", "Neuhausen-Nymphenburg")
    testFormData.append("startTime", "1-2-wochen")
    testFormData.append("message", "")

    console.log("📝 Test form data prepared:")
    for (const [key, value] of testFormData.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    // Test the waitlist action directly
    console.log("\n2. Testing waitlist action...")

    const response = await fetch("/api/test-waitlist", {
      method: "POST",
      body: testFormData,
    })

    console.log("📡 Response status:", response.status)
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Response data:", result)
    } else {
      const errorText = await response.text()
      console.log("❌ Error response:", errorText)
    }
  } catch (error) {
    console.error("❌ Debug script error:", error)
  }
}

// Test Firebase connection
async function testFirebaseConnection() {
  console.log("\n3. Testing Firebase connection...")

  try {
    const response = await fetch("/api/debug-firestore")
    const result = await response.json()

    console.log("🔥 Firebase status:", result)

    if (result.hasRealConfig) {
      console.log("✅ Real Firebase config detected")
    } else {
      console.log("⚠️ Using mock Firebase config")
    }
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error)
  }
}

// Test admin users API
async function testAdminUsersAPI() {
  console.log("\n4. Testing admin users API...")

  try {
    const response = await fetch("/api/admin/users")
    const result = await response.json()

    console.log("👥 Admin users API response:", result)
    console.log(`📊 Found ${result.count || 0} users`)
  } catch (error) {
    console.error("❌ Admin users API test failed:", error)
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log("\n5. Checking environment variables...")

  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`)
    } else {
      console.log(`❌ ${envVar}: NOT SET`)
    }
  })
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Munich form debug tests...\n")

  checkEnvironmentVariables()
  await testFirebaseConnection()
  await testAdminUsersAPI()
  await debugMunichFormSubmission()

  console.log("\n✨ Debug tests completed!")
}

// Execute if running directly
if (typeof window !== "undefined") {
  // Browser environment
  runAllTests()
} else {
  // Node.js environment
  console.log("Run this script in the browser console on your Munich page")
  console.log("Or visit: /personal-training-muenchen and paste this script in the console")
}
