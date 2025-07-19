import fetch from "node-fetch"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

async function testTrainerCreationFlow() {
  console.log("🔍 Testing Trainer Creation Flow")
  console.log("================================")

  // Test data
  const testFormData = {
    fullName: "Test Trainer",
    email: "test@example.com",
    phone: "+1234567890",
    location: "New York, NY",
    specialty: "Personal Training",
    experience: "3-5 years",
    bio: "I'm a certified personal trainer with experience helping clients achieve their fitness goals through personalized workout plans and nutrition guidance.",
    certifications: "NASM-CPT, ACE Personal Trainer",
    services: ["Personal Training", "Nutrition Coaching", "Weight Loss Programs"],
  }

  try {
    console.log("📤 Sending POST request to /api/trainer/create")
    console.log("Request data:", JSON.stringify(testFormData, null, 2))

    const response = await fetch(`${BASE_URL}/api/trainer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testFormData),
    })

    console.log("\n📥 Response Status:", response.status)
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("\n📄 Raw Response:", responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log("\n✅ Parsed Response:", JSON.stringify(responseData, null, 2))
    } catch (parseError) {
      console.log("\n❌ Failed to parse response as JSON:", parseError.message)
      return
    }

    if (responseData.success && responseData.tempId) {
      console.log("\n🎉 Creation successful!")
      console.log("Temp ID:", responseData.tempId)
      console.log("Redirect URL:", responseData.redirectUrl)

      // Test if the temp trainer can be fetched
      console.log("\n🔍 Testing temp trainer fetch...")
      const fetchResponse = await fetch(`${BASE_URL}/api/trainer/temp/${responseData.tempId}`)
      console.log("Fetch Status:", fetchResponse.status)

      const fetchData = await fetchResponse.json()
      console.log("Fetch Response:", JSON.stringify(fetchData, null, 2))

      if (fetchData.success) {
        console.log("✅ Temp trainer can be fetched successfully")
        console.log("Full URL that should work:", `${BASE_URL}/marketplace/trainer/temp/${responseData.tempId}`)
      } else {
        console.log("❌ Temp trainer fetch failed")
      }
    } else {
      console.log("\n❌ Creation failed")
      console.log("Error:", responseData.error)
      console.log("Details:", responseData.details)
    }
  } catch (error) {
    console.error("\n💥 Network Error:", error.message)
    console.error("Stack:", error.stack)
  }
}

// Test Firebase connection
async function testFirebaseConnection() {
  console.log("\n🔥 Testing Firebase Connection")
  console.log("==============================")

  try {
    const response = await fetch(`${BASE_URL}/api/debug-firestore`)
    const data = await response.json()
    console.log("Firebase Status:", JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Firebase test failed:", error.message)
  }
}

// Run tests
async function runAllTests() {
  await testFirebaseConnection()
  await testTrainerCreationFlow()
}

runAllTests().catch(console.error)
