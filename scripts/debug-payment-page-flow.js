// Debug script to test the payment page flow
console.log("=== DEBUGGING PAYMENT PAGE FLOW ===")

async function testPaymentPageFlow() {
  const tempId = "a2hKORaVcPvJ5oXOj4Udg" // From the URL you provided

  console.log("1. Testing temp trainer API endpoint...")

  try {
    const response = await fetch(`/api/trainer/temp/${tempId}`)
    const data = await response.json()

    console.log("API Response Status:", response.status)
    console.log("API Response Headers:", Object.fromEntries(response.headers.entries()))
    console.log("API Response Data:", data)

    if (response.ok) {
      console.log("✅ API call successful")

      if (data.success) {
        console.log("✅ API returned success: true")

        if (data.trainer) {
          console.log("✅ Trainer data exists")
          console.log("Trainer ID:", data.trainer.id)
          console.log("Trainer Name:", data.trainer.fullName)
          console.log("Trainer Email:", data.trainer.email)
          console.log("Trainer Status:", data.trainer.status)
        } else {
          console.log("❌ No trainer data in response")
        }
      } else {
        console.log("❌ API returned success: false")
        console.log("Error:", data.error)
      }
    } else {
      console.log("❌ API call failed")
      console.log("Error:", data.error || "Unknown error")
    }
  } catch (error) {
    console.error("❌ Network error:", error)
  }

  console.log("\n2. Testing payment page component logic...")

  // Simulate the payment page logic
  const searchParams = new URLSearchParams(`tempId=${tempId}`)
  const tempIdFromParams = searchParams.get("tempId")

  console.log("TempId from URL params:", tempIdFromParams)

  if (!tempIdFromParams) {
    console.log("❌ No tempId in URL parameters")
  } else {
    console.log("✅ TempId found in URL parameters")
  }
}

// Run the test
testPaymentPageFlow()
