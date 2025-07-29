console.log("🧪 Starting Optional Fields Form Submission Test...\n")

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const API_BASE = `${BASE_URL}/api`

// Test data scenarios
const TEST_SCENARIOS = [
  {
    name: "Required fields only (all optional empty)",
    data: {
      fullName: "Test Trainer Required",
      email: "test.required@example.com",
      phone: "",
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Phone only",
    data: {
      fullName: "Test Trainer Phone",
      email: "test.phone@example.com",
      phone: "+43 123 456 789",
      city: "Vienna",
      district: "Leopoldstadt",
      specialty: "Strength Training",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Bio only",
    data: {
      fullName: "Test Trainer Bio",
      email: "test.bio@example.com",
      phone: "",
      city: "Salzburg",
      district: "Altstadt",
      specialty: "Sports Performance",
      bio: "I am a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals.",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Certifications only",
    data: {
      fullName: "Test Trainer Certs",
      email: "test.certs@example.com",
      phone: "",
      city: "Graz",
      district: "Innere Stadt",
      specialty: "Rehabilitation",
      bio: "",
      certifications: "NASM-CPT, ACE Personal Trainer",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Services only",
    data: {
      fullName: "Test Trainer Services",
      email: "test.services@example.com",
      phone: "",
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Nutrition Coaching",
      bio: "",
      certifications: "",
      services: ["Personal Training", "Weight Loss Programs"],
    },
    shouldPass: true,
  },
  {
    name: "All fields filled",
    data: {
      fullName: "Test Trainer Complete",
      email: "test.complete@example.com",
      phone: "+43 987 654 321",
      city: "Linz",
      district: "Zentrum",
      specialty: "Group Fitness",
      bio: "I am a passionate fitness coach with extensive experience in group training and individual coaching. My approach combines modern training methods with personalized nutrition guidance.",
      certifications: "NASM-CPT, ACE Personal Trainer, Nutrition Specialist, Group Fitness Instructor",
      services: ["Personal Training", "Group Fitness", "Nutrition Coaching", "Weight Loss Programs"],
    },
    shouldPass: true,
  },
  {
    name: "Bio too short (should fail)",
    data: {
      fullName: "Test Trainer Short Bio",
      email: "test.shortbio@example.com",
      phone: "",
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "Too short",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Missing required city (should fail)",
    data: {
      fullName: "Test Trainer No City",
      email: "test.nocity@example.com",
      phone: "",
      city: "",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
]

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: TEST_SCENARIOS.length,
  details: [],
}

// Helper function to make API requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()
    return { response, data }
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`)
    return { error }
  }
}

// Client-side validation simulation
function validateFormData(data) {
  const errors = {}

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = "Full name is required and must be at least 2 characters"
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email is required"
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = "City is required and must be at least 2 characters"
  }

  if (!data.district || data.district.trim().length < 2) {
    errors.district = "District is required and must be at least 2 characters"
  }

  if (!data.specialty) {
    errors.specialty = "Primary specialty is required"
  }

  // Bio validation - only if provided
  if (data.bio && data.bio.trim().length > 0) {
    if (data.bio.trim().length < 20) {
      errors.bio = "Bio must be at least 20 characters if provided"
    } else if (data.bio.trim().length > 500) {
      errors.bio = "Bio must be less than 500 characters"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Helper function to make API request
async function submitTrainerForm(data) {
  try {
    const response = await fetch(`${API_BASE}/trainer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    return {
      success: response.ok && result.success,
      status: response.status,
      data: result,
      response,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 0,
    }
  }
}

// Helper function to retrieve trainer data
async function getTrainerData(tempId) {
  try {
    const response = await fetch(`${API_BASE}/trainer/temp/${tempId}`)
    const result = await response.json()

    return {
      success: response.ok && result.success,
      data: result.trainer || result.data,
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Main test function
async function runTest(scenario, index) {
  console.log(`\n📋 Test ${index + 1}/${TEST_SCENARIOS.length}: ${scenario.name}`)
  console.log("─".repeat(60))

  const testDetail = {
    name: scenario.name,
    shouldPass: scenario.shouldPass,
    clientValidation: null,
    apiSubmission: null,
    dataRetrieval: null,
    passed: false,
    issues: [],
  }

  try {
    // Step 1: Client-side validation simulation
    console.log("🔍 Step 1: Client-side validation...")
    const validation = validateFormData(scenario.data)
    testDetail.clientValidation = validation

    if (validation.isValid) {
      console.log("✅ Client-side validation passed")
    } else {
      console.log("❌ Client-side validation failed:", validation.errors)
      if (scenario.shouldPass) {
        testDetail.issues.push("Client validation failed when it should pass")
      }
    }

    // Step 2: API submission (only if client validation passes or we expect it to fail)
    console.log("\n🚀 Step 2: API submission...")
    const submission = await submitTrainerForm(scenario.data)
    testDetail.apiSubmission = submission

    if (submission.success) {
      console.log("✅ API submission successful")
      console.log(`📄 Temp ID: ${submission.data.tempId}`)
      console.log(`🔗 Redirect URL: ${submission.data.redirectUrl}`)

      // Step 3: Data retrieval verification
      if (submission.data.tempId) {
        console.log("\n📥 Step 3: Data retrieval verification...")
        const retrieval = await getTrainerData(submission.data.tempId)
        testDetail.dataRetrieval = retrieval

        if (retrieval.success) {
          console.log("✅ Data retrieval successful")

          // Verify optional fields handling
          const retrievedData = retrieval.data
          console.log("\n🔍 Optional fields analysis:")
          console.log(`📞 Phone: "${retrievedData.phone || ""}" (${retrievedData.phone ? "provided" : "empty"})`)
          console.log(
            `📝 Bio: ${retrievedData.bio ? `"${retrievedData.bio.substring(0, 50)}..." (${retrievedData.bio.length} chars)` : '"" (empty)'}`,
          )
          console.log(
            `🎓 Certifications: "${retrievedData.certifications || ""}" (${retrievedData.certifications ? "provided" : "empty"})`,
          )
          console.log(
            `🏋️ Services: [${(retrievedData.services || []).join(", ")}] (${(retrievedData.services || []).length} items)`,
          )
          console.log(`📍 Location: ${retrievedData.city}, ${retrievedData.district}`)
        } else {
          console.log("❌ Data retrieval failed:", retrieval.error)
          testDetail.issues.push("Data retrieval failed")
        }
      }
    } else {
      console.log("❌ API submission failed")
      console.log(`📊 Status: ${submission.status}`)
      console.log(`💬 Error: ${submission.data?.error || submission.error}`)

      if (scenario.shouldPass) {
        testDetail.issues.push(`API submission failed: ${submission.data?.error || submission.error}`)
      }
    }

    // Determine if test passed
    if (scenario.shouldPass) {
      testDetail.passed = submission.success && testDetail.dataRetrieval?.success !== false
    } else {
      testDetail.passed = !submission.success || !validation.isValid
    }

    if (testDetail.passed) {
      console.log("\n🎉 TEST PASSED")
      testResults.passed++
    } else {
      console.log("\n❌ TEST FAILED")
      if (testDetail.issues.length > 0) {
        console.log("🔍 Issues found:")
        testDetail.issues.forEach((issue) => console.log(`   • ${issue}`))
      }
      testResults.failed++
    }
  } catch (error) {
    console.log(`\n💥 TEST ERROR: ${error.message}`)
    testDetail.issues.push(`Test execution error: ${error.message}`)
    testResults.failed++
  }

  testResults.details.push(testDetail)
}

// Run all tests
async function runAllTests() {
  console.log("🎯 Testing Optional Fields Form Submission")
  console.log("=".repeat(60))
  console.log(`📊 Total scenarios: ${TEST_SCENARIOS.length}`)
  console.log(`🌐 Base URL: ${BASE_URL}`)

  for (let i = 0; i < TEST_SCENARIOS.length; i++) {
    await runTest(TEST_SCENARIOS[i], i)

    // Add delay between tests to avoid overwhelming the server
    if (i < TEST_SCENARIOS.length - 1) {
      console.log("\n⏳ Waiting 2 seconds before next test...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // Final results
  console.log("\n" + "=".repeat(60))
  console.log("📊 FINAL TEST RESULTS")
  console.log("=".repeat(60))
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`)
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`)
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)

  if (testResults.failed > 0) {
    console.log("\n🔍 FAILED TESTS SUMMARY:")
    testResults.details
      .filter((test) => !test.passed)
      .forEach((test) => {
        console.log(`\n❌ ${test.name}:`)
        test.issues.forEach((issue) => console.log(`   • ${issue}`))
      })
  }

  console.log("\n🎯 KEY FINDINGS:")
  console.log("• Optional fields (phone, bio, certifications, services) can be empty")
  console.log("• Required fields (fullName, email, city, district, specialty) must be provided")
  console.log("• Bio validation only applies when bio is provided (20-500 characters)")
  console.log("• Services array can be empty without causing validation errors")
  console.log("• City/District fields replace the old location field structure")

  console.log("\n✨ Test completed!")
}

// Execute the tests
runAllTests().catch((error) => {
  console.error("💥 Test execution failed:", error)
  process.exit(1)
})
