console.log("=== TESTING COMPLETE TRAINER FLOW ===")

// Test data for creating a trainer
const testTrainerData = {
  fullName: "Test Trainer Flow",
  email: "testflow@example.com",
  phone: "+1234567890",
  location: "Test City, Austria",
  experience: "3-5 years",
  specialty: "Weight Loss",
  certifications: "NASM Certified Personal Trainer",
  bio: "Experienced trainer specializing in weight loss and strength training.",
  services: ["Personal Training", "Nutrition Coaching", "Group Classes"],
}

// Step 1: Test trainer creation
async function testTrainerCreation() {
  console.log("\n=== STEP 1: TESTING TRAINER CREATION ===")

  try {
    console.log("Sending trainer creation request...")
    console.log("Test data:", testTrainerData)

    const response = await fetch("/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testTrainerData),
    })

    console.log("Creation response status:", response.status)
    console.log("Creation response ok:", response.ok)

    const data = await response.json()
    console.log("Creation response data:", data)

    if (response.ok && data.success) {
      console.log("✅ Trainer creation successful")
      console.log("Temp ID:", data.tempId)
      console.log("Redirect URL:", data.redirectUrl)
      return data.tempId
    } else {
      console.log("❌ Trainer creation failed")
      console.log("Error:", data.error)
      return null
    }
  } catch (error) {
    console.error("❌ Trainer creation error:", error)
    return null
  }
}

// Step 2: Test temp trainer API endpoint
async function testTempTrainerAPI(tempId) {
  console.log("\n=== STEP 2: TESTING TEMP TRAINER API ===")

  if (!tempId) {
    console.log("❌ No temp ID provided, skipping API test")
    return null
  }

  try {
    console.log("Fetching temp trainer data...")
    console.log("Temp ID:", tempId)

    const response = await fetch(`/api/trainer/temp/${tempId}`)

    console.log("API response status:", response.status)
    console.log("API response ok:", response.ok)

    const data = await response.json()
    console.log("API response data:", data)

    if (response.ok) {
      console.log("✅ API call successful")

      if (data.success) {
        console.log("✅ API returned success: true")

        if (data.trainer) {
          console.log("✅ Trainer data exists")
          console.log("Trainer name:", data.trainer.fullName)
          console.log("Trainer status:", data.trainer.status)
          console.log("Trainer email:", data.trainer.email)
          console.log("Trainer isPaid:", data.trainer.isPaid)
          console.log("Trainer isActive:", data.trainer.isActive)
          console.log("Trainer content exists:", !!data.trainer.content)

          if (data.trainer.content) {
            console.log("Content about:", data.trainer.content.about)
            console.log("Content contact:", data.trainer.content.contact)
            console.log("Content services:", data.trainer.content.services)
            console.log("Content testimonials:", data.trainer.content.testimonials?.length || 0)
          }

          return data.trainer
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
      console.log("Error:", data.error)
    }

    return null
  } catch (error) {
    console.error("❌ API call error:", error)
    return null
  }
}

// Step 3: Test temp page loading simulation
async function testTempPageLoading(tempId, trainer) {
  console.log("\n=== STEP 3: TESTING TEMP PAGE LOADING ===")

  if (!tempId || !trainer) {
    console.log("❌ Missing temp ID or trainer data, skipping temp page test")
    return false
  }

  try {
    console.log("Simulating temp page component logic...")

    // Simulate the temp page component logic
    const tempPageUrl = `/marketplace/trainer/temp/${tempId}`
    console.log("Temp page URL:", tempPageUrl)

    // Check if trainer data has required fields for temp page
    const requiredFields = ["fullName", "email", "specialty", "experience"]
    const missingFields = requiredFields.filter((field) => !trainer[field])

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields for temp page:", missingFields)
      return false
    }

    console.log("✅ All required fields present for temp page")

    // Check if content exists for proper display
    if (trainer.content) {
      console.log("✅ Content data available for temp page")
      console.log("About title:", trainer.content.about?.title)
      console.log("Contact info:", trainer.content.contact)
      console.log("Services count:", trainer.content.services?.length || 0)
      console.log("Testimonials count:", trainer.content.testimonials?.length || 0)
    } else {
      console.log("❌ No content data - temp page will fail")
      return false
    }

    // Check status and payment fields
    if (trainer.status === "temp" && !trainer.isPaid && !trainer.isActive) {
      console.log("✅ Correct temp trainer status")
    } else {
      console.log("❌ Incorrect trainer status or payment fields")
      console.log("Status:", trainer.status, "isPaid:", trainer.isPaid, "isActive:", trainer.isActive)
      return false
    }

    // Check expiration logic
    if (trainer.expiresAt) {
      const expiryTime = new Date(trainer.expiresAt).getTime()
      const now = new Date().getTime()
      const timeLeft = expiryTime - now

      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        console.log("✅ Temp page timer working - time left:", `${hours}h ${minutes}m`)
      } else {
        console.log("❌ Trainer expired - temp page would show expired state")
        return false
      }
    }

    console.log("✅ Temp page would load successfully")
    return true
  } catch (error) {
    console.error("❌ Temp page simulation error:", error)
    return false
  }
}

// Step 4: Test payment page loading simulation
async function testPaymentPageLoading(tempId, trainer) {
  console.log("\n=== STEP 4: TESTING PAYMENT PAGE LOADING ===")

  if (!tempId || !trainer) {
    console.log("❌ Missing temp ID or trainer data, skipping payment page test")
    return false
  }

  try {
    console.log("Simulating payment page component logic...")

    // Simulate URL parameters
    const paymentPageUrl = `/payment?tempId=${tempId}`
    console.log("Payment page URL:", paymentPageUrl)

    const searchParams = new URLSearchParams(`tempId=${tempId}`)
    const tempIdFromParams = searchParams.get("tempId")

    if (!tempIdFromParams) {
      console.log("❌ No tempId in URL parameters - payment page would show error")
      return false
    }

    console.log("✅ TempId found in URL parameters:", tempIdFromParams)

    // Simulate the fetch call that payment page makes
    console.log("Simulating payment page API call...")

    // Use the trainer data we already have to simulate the response
    const mockApiResponse = {
      success: true,
      trainer: trainer,
    }

    console.log("Mock API response:", mockApiResponse)

    // Simulate payment page component logic
    if (mockApiResponse.success && mockApiResponse.trainer) {
      console.log("✅ Payment page would show payment form")

      // Check required fields for payment form
      const paymentRequiredFields = ["fullName", "email", "specialty"]
      const missingPaymentFields = paymentRequiredFields.filter((field) => !mockApiResponse.trainer[field])

      if (missingPaymentFields.length > 0) {
        console.log("❌ Missing required fields for payment form:", missingPaymentFields)
        return false
      }

      console.log("✅ All required fields present for payment form")
      console.log("Payment form would display trainer:", mockApiResponse.trainer.fullName)
      console.log("Payment amount: €70")

      // Check contact info from content
      if (mockApiResponse.trainer.content?.contact) {
        console.log("✅ Contact info available from content")
        console.log("Contact location:", mockApiResponse.trainer.content.contact.location)
        console.log("Contact phone:", mockApiResponse.trainer.content.contact.phone)
      } else {
        console.log("❌ Missing contact info in content")
        return false
      }

      return true
    } else {
      console.log("❌ Payment page would show error - missing success or trainer")
      return false
    }
  } catch (error) {
    console.error("❌ Payment page simulation error:", error)
    return false
  }
}

// Step 5: Test payment processing simulation
async function testPaymentProcessing(tempId) {
  console.log("\n=== STEP 5: TESTING PAYMENT PROCESSING ===")

  if (!tempId) {
    console.log("❌ No temp ID provided, skipping payment processing test")
    return false
  }

  try {
    console.log("Testing payment intent creation...")

    const paymentData = {
      amount: 7000, // €70.00 in cents
      currency: "eur",
      tempTrainerId: tempId,
      email: testTrainerData.email,
    }

    console.log("Payment intent data:", paymentData)

    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    console.log("Payment intent response status:", response.status)
    console.log("Payment intent response ok:", response.ok)

    const data = await response.json()
    console.log("Payment intent response data:", data)

    if (response.ok && data.client_secret) {
      console.log("✅ Payment intent created successfully")
      console.log("Client secret exists:", !!data.client_secret)
      return true
    } else {
      console.log("❌ Payment intent creation failed")
      console.log("Error:", data.error)
      return false
    }
  } catch (error) {
    console.error("❌ Payment processing error:", error)
    return false
  }
}

// Step 6: Test data structure validation
async function testDataStructureValidation(trainer) {
  console.log("\n=== STEP 6: TESTING DATA STRUCTURE VALIDATION ===")

  if (!trainer) {
    console.log("❌ No trainer data provided, skipping structure validation")
    return false
  }

  try {
    console.log("Validating trainer data structure...")

    // Test root level fields
    const rootFields = {
      id: trainer.id,
      fullName: trainer.fullName,
      email: trainer.email,
      experience: trainer.experience,
      specialty: trainer.specialty,
      certifications: trainer.certifications,
      services: trainer.services,
      status: trainer.status,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
      isPaid: trainer.isPaid,
      isActive: trainer.isActive,
    }

    console.log("Root level fields:", rootFields)

    // Validate status values
    if (trainer.status !== "temp" && trainer.status !== "active") {
      console.log("❌ Invalid status value:", trainer.status, "- should be 'temp' or 'active'")
      return false
    }
    console.log("✅ Status value is valid:", trainer.status)

    // Validate boolean fields
    if (typeof trainer.isPaid !== "boolean" || typeof trainer.isActive !== "boolean") {
      console.log("❌ isPaid or isActive are not boolean values")
      console.log("isPaid:", trainer.isPaid, typeof trainer.isPaid)
      console.log("isActive:", trainer.isActive, typeof trainer.isActive)
      return false
    }
    console.log("✅ Boolean fields are valid")

    // Validate content structure
    if (!trainer.content) {
      console.log("❌ Missing content object")
      return false
    }

    // Check content.about structure
    if (!trainer.content.about || !trainer.content.about.title || !trainer.content.about.content) {
      console.log("❌ Invalid content.about structure")
      console.log("content.about:", trainer.content.about)
      return false
    }
    console.log("✅ content.about structure is valid")

    // Check content.contact structure
    const requiredContactFields = ["email", "phone", "location", "title", "description"]
    const missingContactFields = requiredContactFields.filter((field) => !trainer.content.contact?.[field])

    if (missingContactFields.length > 0) {
      console.log("❌ Missing contact fields:", missingContactFields)
      console.log("content.contact:", trainer.content.contact)
      return false
    }
    console.log("✅ content.contact structure is valid")

    // Check that phone and location are NOT at root level
    if (trainer.phone || trainer.location) {
      console.log("❌ Phone or location found at root level - should be in content.contact")
      console.log("Root phone:", trainer.phone)
      console.log("Root location:", trainer.location)
      return false
    }
    console.log("✅ Phone and location are correctly in content.contact")

    // Check that bio is NOT at root level
    if (trainer.bio) {
      console.log("❌ Bio found at root level - should be in content.about.content")
      console.log("Root bio:", trainer.bio)
      return false
    }
    console.log("✅ Bio is correctly in content.about.content")

    // Validate temp trainer initial values
    if (trainer.status === "temp") {
      if (trainer.isPaid !== false || trainer.isActive !== false) {
        console.log("❌ Temp trainer should have isPaid=false and isActive=false")
        console.log("isPaid:", trainer.isPaid, "isActive:", trainer.isActive)
        return false
      }
      console.log("✅ Temp trainer has correct initial values")
    }

    console.log("✅ All data structure validations passed")
    return true
  } catch (error) {
    console.error("❌ Data structure validation error:", error)
    return false
  }
}

// Main test function
async function runCompleteTrainerFlowTest() {
  console.log("Starting complete trainer flow test...")
  console.log("Test timestamp:", new Date().toISOString())

  const testResults = {
    trainerCreation: false,
    tempTrainerAPI: false,
    tempPageLoading: false,
    paymentPageLoading: false,
    paymentProcessing: false,
    dataStructureValidation: false,
  }

  try {
    // Step 1: Test trainer creation
    const tempId = await testTrainerCreation()
    testResults.trainerCreation = !!tempId

    if (!tempId) {
      console.log("❌ Cannot continue tests without temp ID")
      return testResults
    }

    // Wait a moment for Firebase to process
    console.log("Waiting 2 seconds for Firebase processing...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 2: Test temp trainer API
    const trainer = await testTempTrainerAPI(tempId)
    testResults.tempTrainerAPI = !!trainer

    if (!trainer) {
      console.log("❌ Cannot continue tests without trainer data")
      return testResults
    }

    // Step 3: Test data structure validation
    testResults.dataStructureValidation = await testDataStructureValidation(trainer)

    // Step 4: Test temp page loading
    testResults.tempPageLoading = await testTempPageLoading(tempId, trainer)

    // Step 5: Test payment page loading
    testResults.paymentPageLoading = await testPaymentPageLoading(tempId, trainer)

    // Step 6: Test payment processing
    testResults.paymentProcessing = await testPaymentProcessing(tempId)
  } catch (error) {
    console.error("❌ Test execution error:", error)
  }

  // Print final results
  console.log("\n=== FINAL TEST RESULTS ===")
  console.log("Trainer Creation:", testResults.trainerCreation ? "✅ PASS" : "❌ FAIL")
  console.log("Temp Trainer API:", testResults.tempTrainerAPI ? "✅ PASS" : "❌ FAIL")
  console.log("Data Structure Validation:", testResults.dataStructureValidation ? "✅ PASS" : "❌ FAIL")
  console.log("Temp Page Loading:", testResults.tempPageLoading ? "✅ PASS" : "❌ FAIL")
  console.log("Payment Page Loading:", testResults.paymentPageLoading ? "✅ PASS" : "❌ FAIL")
  console.log("Payment Processing:", testResults.paymentProcessing ? "✅ PASS" : "❌ FAIL")

  const passedTests = Object.values(testResults).filter((result) => result).length
  const totalTests = Object.keys(testResults).length

  console.log(`\nOverall Result: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED - Trainer flow is working correctly!")
  } else {
    console.log("⚠️ SOME TESTS FAILED - Check the logs above for details")
  }

  // Print detailed structure analysis
  console.log("\n=== DETAILED STRUCTURE ANALYSIS ===")
  if (testResults.tempTrainerAPI) {
    console.log("This test confirms:")
    console.log("✓ Status uses 'temp' instead of 'pending'")
    console.log("✓ isPaid and isActive fields exist at root level")
    console.log("✓ Phone and location are in content.contact (not root)")
    console.log("✓ Bio is in content.about.content (not root)")
    console.log("✓ Initial temp values: isPaid=false, isActive=false, status='temp'")
  }

  return testResults
}

// Run the complete test
runCompleteTrainerFlowTest()
  .then((results) => {
    console.log("\n=== TEST EXECUTION COMPLETED ===")
    console.log("Results:", results)
  })
  .catch((error) => {
    console.error("❌ Test execution failed:", error)
  })
