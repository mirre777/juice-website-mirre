console.log("=== DEBUGGING PAYMENT PAGE FLOW ===")

// Test temp trainer API endpoint
async function testTempTrainerAPI() {
  console.log("1. Testing temp trainer API endpoint...")

  const tempId = "a2hKORaVcPvJ5oXOj4Udg" // Use the actual temp ID from your URL

  try {
    const response = await fetch(`/api/trainer/temp/${tempId}`)
    console.log("API Response Status:", response.status)
    console.log("API Response OK:", response.ok)

    const data = await response.json()
    console.log("API Response Data:", data)

    // Check if response has success field
    if (data.success !== undefined) {
      console.log("✅ Response has success field:", data.success)
    } else {
      console.log("❌ Response missing success field")
    }

    // Check if trainer data exists
    if (data.trainer) {
      console.log("✅ Trainer data exists")
      console.log("Trainer status:", data.trainer.status)
      console.log("Trainer content:", data.trainer.content)
    } else {
      console.log("❌ No trainer data in response")
    }

    return data
  } catch (error) {
    console.error("❌ API Error:", error)
    return null
  }
}

// Test payment page component logic
async function testPaymentPageFlow() {
  console.log("\n2. Testing payment page component logic...")

  const tempId = "a2hKORaVcPvJ5oXOj4Udg"
  console.log("TempId from URL params:", tempId)

  if (!tempId) {
    console.log("❌ No tempId found in URL parameters")
    return
  } else {
    console.log("✅ TempId found in URL parameters")
  }

  // Simulate the fetch logic from payment page
  try {
    const baseUrl = window.location.origin
    const apiUrl = `${baseUrl}/api/trainer/temp/${tempId}`
    console.log("Constructed API URL:", apiUrl)

    const response = await fetch(apiUrl)
    const data = await response.json()

    console.log("Payment page fetch result:", data)

    // Simulate the component logic
    if (!response.ok) {
      console.log("❌ Response not ok - would show error")
      return
    }

    if (data.success && data.trainer) {
      console.log("✅ Would show payment form")
    } else {
      console.log("❌ Would show error - missing success or trainer")
      console.log("Success:", data.success)
      console.log("Trainer:", !!data.trainer)
    }
  } catch (error) {
    console.error("❌ Payment page fetch error:", error)
  }
}

// Run tests
async function runAllTests() {
  await testTempTrainerAPI()
  await testPaymentPageFlow()

  console.log("\n=== SUMMARY ===")
  console.log("Check the logs above to identify the exact issue.")
}

runAllTests()
