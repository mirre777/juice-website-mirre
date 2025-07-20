// Debug script to test the payment page flow
console.log("=== DEBUGGING PAYMENT PAGE FLOW ===")

async function testPaymentPageFlow() {
  const tempId = "a2hKORaVcPvJ5oXOj4Udg" // From the URL you provided

  console.log("1. Testing temp trainer API endpoint...")

  try {
    // Test the API endpoint directly
    const response = await fetch(`/api/trainer/temp/${tempId}`)

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)
    console.log("Response URL:", response.url)

    if (!response.ok) {
      console.log("❌ Response not OK")
      const errorText = await response.text()
      console.log("Error response:", errorText)
      return
    }

    const data = await response.json()

    console.log("=== API RESPONSE ANALYSIS ===")
    console.log("Full response data:", JSON.stringify(data, null, 2))
    console.log("Response success field:", data.success)
    console.log("Response error field:", data.error)
    console.log("Response trainer field exists:", !!data.trainer)

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
          console.log("Trainer Location:", data.trainer.location)
          console.log("Trainer Specialty:", data.trainer.specialty)
          console.log("Trainer Experience:", data.trainer.experience)
          console.log("Trainer Services:", data.trainer.services)
        } else {
          console.log("❌ No trainer data in response")
        }
      } else {
        console.log("❌ API returned success: false")
        console.log("Error:", data.error)
      }
    } else {
      console.log("❌ API call failed")
      console.log("Status:", response.status)
      console.log("Error:", data.error || "Unknown error")
    }
  } catch (error) {
    console.error("❌ Network error:", error)
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
  }

  console.log("\n=== TESTING URL PARAMETER PARSING ===")

  // Test URL parameter parsing
  const testUrl = `https://example.com/payment?tempId=${tempId}`
  const url = new URL(testUrl)
  const searchParams = url.searchParams
  const tempIdFromParams = searchParams.get("tempId")

  console.log("Test URL:", testUrl)
  console.log("TempId from URL params:", tempIdFromParams)

  if (!tempIdFromParams) {
    console.log("❌ No tempId in URL parameters")
  } else {
    console.log("✅ TempId found in URL parameters")
    console.log("TempId matches original:", tempIdFromParams === tempId)
  }

  console.log("\n=== TESTING ABSOLUTE URL CONSTRUCTION ===")

  // Test absolute URL construction (simulating browser environment)
  const baseUrl = "https://v0-v2-website-git-webpage-inline-editor-mirre777s-projects.vercel.app"
  const absoluteApiUrl = `${baseUrl}/api/trainer/temp/${tempId}`

  console.log("Base URL:", baseUrl)
  console.log("Absolute API URL:", absoluteApiUrl)

  try {
    const absoluteUrlTest = new URL(absoluteApiUrl)
    console.log("✅ Absolute URL is valid")
    console.log("Protocol:", absoluteUrlTest.protocol)
    console.log("Host:", absoluteUrlTest.host)
    console.log("Pathname:", absoluteUrlTest.pathname)
  } catch (urlError) {
    console.log("❌ Absolute URL is invalid:", urlError.message)
  }

  console.log("\n=== PAYMENT PAGE COMPONENT SIMULATION ===")

  // Simulate the payment page component logic
  const mockSearchParams = new URLSearchParams(`tempId=${tempId}`)
  const mockTempId = mockSearchParams.get("tempId")

  console.log("Mock search params:", mockSearchParams.toString())
  console.log("Mock tempId:", mockTempId)

  if (!mockTempId) {
    console.log("❌ Component would show 'No trainer ID provided' error")
  } else {
    console.log("✅ Component would proceed to fetch trainer data")

    // Simulate the fetch logic from the component
    try {
      const mockBaseUrl = typeof window !== "undefined" ? window.location.origin : baseUrl
      const mockApiUrl = `${mockBaseUrl}/api/trainer/temp/${mockTempId}`

      console.log("Component would fetch from:", mockApiUrl)
      console.log("✅ Component fetch URL construction successful")
    } catch (componentError) {
      console.log("❌ Component fetch URL construction failed:", componentError.message)
    }
  }
}

// Run the test
console.log("Starting payment page flow test...")
testPaymentPageFlow()
  .then(() => {
    console.log("\n=== TEST COMPLETED ===")
  })
  .catch((error) => {
    console.error("Test failed:", error)
  })
