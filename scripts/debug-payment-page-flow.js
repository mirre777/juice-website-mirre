console.log("=== DEBUGGING PAYMENT PAGE FLOW ===")

// Test 1: Testing temp trainer API endpoint
async function testTempTrainerAPI() {
  console.log("1. Testing temp trainer API endpoint...")

  const tempId = "a2hKORaVcPvJ5oXOj4Udg" // Use the actual temp ID from your test

  try {
    const response = await fetch(`/api/trainer/temp/${tempId}`)
    console.log("API Response Status:", response.status)
    console.log("API Response OK:", response.ok)

    const data = await response.json()
    console.log("API Response Data:", data)

    // Check if response has expected structure
    if (data.success) {
      console.log("✅ API returns success field")
    } else {
      console.log("❌ API missing success field")
    }

    if (data.trainer) {
      console.log("✅ API returns trainer data")
      console.log("Trainer Status:", data.trainer.status)
    } else {
      console.log("❌ API missing trainer data")
    }
  } catch (error) {
    console.error("❌ API Error:", error)
  }
}

// Test 2: Testing payment page component logic
function testPaymentPageLogic() {
  console.log("2. Testing payment page component logic...")

  const urlParams = new URLSearchParams(window.location.search)
  const tempId = urlParams.get("tempId")

  console.log("TempId from URL params:", tempId)

  if (tempId) {
    console.log("✅ TempId found in URL parameters")
  } else {
    console.log("❌ TempId not found in URL parameters")
  }
}

// Test 3: Testing absolute URL construction
function testAbsoluteURL() {
  console.log("3. Testing absolute URL construction...")

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const tempId = "a2hKORaVcPvJ5oXOj4Udg"
  const apiUrl = `${baseUrl}/api/trainer/temp/${tempId}`

  console.log("Base URL:", baseUrl)
  console.log("Constructed API URL:", apiUrl)

  try {
    new URL(apiUrl)
    console.log("✅ URL construction successful")
  } catch (error) {
    console.log("❌ URL construction failed:", error)
  }
}

// Run all tests
async function runAllTests() {
  await testTempTrainerAPI()
  testPaymentPageLogic()
  testAbsoluteURL()
  console.log("=== DEBUGGING COMPLETE ===")
}

runAllTests()
