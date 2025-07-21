console.log("=== TRAINER CREATION FLOW DEBUG ===")

// Test data
const testTrainerData = {
  fullName: "Test Trainer",
  email: "test@example.com",
  phone: "+1234567890",
  location: "Test City",
  experience: "5+ years",
  specialty: "Weight Training",
  certifications: "NASM, ACE",
  bio: "Experienced trainer specializing in strength training",
  services: ["Personal Training", "Group Classes"],
}

async function testTrainerCreation() {
  try {
    console.log("1. Testing trainer creation API...")

    const createResponse = await fetch("/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testTrainerData),
    })

    const createResult = await createResponse.json()
    console.log("Create API Response:", createResult)

    if (!createResult.success) {
      console.error("❌ Create API failed:", createResult.error)
      return
    }

    const tempId = createResult.tempId
    console.log("✅ Trainer created with tempId:", tempId)

    // Test fetching the temp trainer
    console.log("2. Testing temp trainer fetch...")

    const fetchResponse = await fetch(`/api/trainer/temp/${tempId}`)
    const fetchResult = await fetchResponse.json()

    console.log("Fetch API Response:", fetchResult)

    if (fetchResult.error) {
      console.error("❌ Fetch API failed:", fetchResult.error)
      return
    }

    console.log("✅ Temp trainer fetched successfully")
    console.log("Trainer data:", fetchResult.trainer)

    // Test the redirect URL
    const redirectUrl = createResult.redirectUrl
    console.log("3. Testing redirect URL:", redirectUrl)

    console.log("=== DEBUG COMPLETE ===")
  } catch (error) {
    console.error("❌ Test failed with error:", error)
  }
}

// Run the test
testTrainerCreation()
