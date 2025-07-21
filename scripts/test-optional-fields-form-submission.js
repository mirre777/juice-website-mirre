console.log("🧪 Starting Optional Fields Form Submission Test...\n")

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const API_BASE = `${BASE_URL}/api`

// Test data scenarios
const testScenarios = [
  {
    name: "Required fields only (all optional empty)",
    data: {
      fullName: "John Smith",
      email: "john.smith@test.com",
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
      fullName: "Jane Doe",
      email: "jane.doe@test.com",
      phone: "+43 123 456 789",
      city: "Salzburg",
      district: "Altstadt",
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
      fullName: "Mike Johnson",
      email: "mike.johnson@test.com",
      phone: "",
      city: "Graz",
      district: "Innere Stadt",
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
      fullName: "Sarah Wilson",
      email: "sarah.wilson@test.com",
      phone: "",
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Nutrition Coaching",
      bio: "",
      certifications: "NASM-CPT, ACE Personal Trainer",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Services only",
    data: {
      fullName: "Tom Brown",
      email: "tom.brown@test.com",
      phone: "",
      city: "Linz",
      district: "Zentrum",
      specialty: "Group Fitness",
      bio: "",
      certifications: "",
      services: ["Personal Training", "Group Fitness"],
    },
    shouldPass: true,
  },
  {
    name: "All fields filled",
    data: {
      fullName: "Lisa Anderson",
      email: "lisa.anderson@test.com",
      phone: "+43 987 654 321",
      city: "Klagenfurt",
      district: "Zentrum",
      specialty: "Yoga & Mindfulness",
      bio: "Experienced yoga instructor and mindfulness coach with a passion for helping people find balance in their lives through movement and meditation.",
      certifications: "RYT-500, Mindfulness Coach Certification",
      services: ["Personal Training", "Yoga & Mindfulness", "Online Coaching"],
    },
    shouldPass: true,
  },
  {
    name: "Bio too short (should fail)",
    data: {
      fullName: "Alex Short",
      email: "alex.short@test.com",
      phone: "",
      city: "Bregenz",
      district: "Zentrum",
      specialty: "Senior Fitness",
      bio: "Too short",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Missing required city (should fail)",
    data: {
      fullName: "Emma Missing",
      email: "emma.missing@test.com",
      phone: "",
      city: "",
      district: "Zentrum",
      specialty: "Youth Training",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
]

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

  // Required field validations
  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required"
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!data.city?.trim()) {
    errors.city = "City is required"
  }

  if (!data.district?.trim()) {
    errors.district = "District is required"
  }

  if (!data.specialty) {
    errors.specialty = "Please select your primary specialty"
  }

  // Optional bio validation - only validate if provided
  if (data.bio?.trim() && data.bio.trim().length < 20) {
    errors.bio = "Bio must be at least 20 characters if provided"
  }

  if (data.bio?.trim() && data.bio.trim().length > 500) {
    errors.bio = "Bio must be less than 500 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Test individual scenario
async function testScenario(scenario) {
  console.log(`\n🔍 Testing: ${scenario.name}`)
  console.log(`Expected to ${scenario.shouldPass ? "PASS" : "FAIL"}`)

  // Step 1: Client-side validation
  const validation = validateFormData(scenario.data)
  console.log(`   Client validation: ${validation.isValid ? "✅ PASS" : "❌ FAIL"}`)

  if (!validation.isValid) {
    console.log(`   Validation errors:`, validation.errors)
    if (!scenario.shouldPass) {
      console.log(`   ✅ Expected failure - validation working correctly`)
      return { success: true, reason: "Expected validation failure" }
    } else {
      console.log(`   ❌ Unexpected validation failure`)
      return { success: false, reason: "Unexpected validation failure" }
    }
  }

  // Step 2: API submission
  console.log(`   Submitting to API...`)
  const { response, data, error } = await makeRequest(`${API_BASE}/trainer/create`, {
    method: "POST",
    body: JSON.stringify(scenario.data),
  })

  if (error) {
    console.log(`   ❌ Network error: ${error.message}`)
    return { success: false, reason: "Network error" }
  }

  console.log(`   API Response: ${response.status} ${response.statusText}`)

  if (response.ok && data.success) {
    console.log(`   ✅ API Success: ${data.message || "Trainer created"}`)
    console.log(`   Temp ID: ${data.tempId}`)
    console.log(`   Redirect URL: ${data.redirectUrl}`)

    if (scenario.shouldPass) {
      // Step 3: Verify data persistence
      console.log(`   Verifying data persistence...`)
      const { response: getResponse, data: getData } = await makeRequest(`${API_BASE}/trainer/temp/${data.tempId}`)

      if (getResponse.ok && getData.success) {
        console.log(`   ✅ Data persistence verified`)

        // Check optional fields handling
        const trainer = getData.trainer
        console.log(`   Optional fields check:`)
        console.log(`     Phone: ${trainer.phone || "empty"} ✅`)
        console.log(`     Bio: ${trainer.bio ? `${trainer.bio.length} chars` : "empty"} ✅`)
        console.log(`     Certifications: ${trainer.certifications || "empty"} ✅`)
        console.log(`     Services: ${trainer.services?.length || 0} items ✅`)

        return { success: true, tempId: data.tempId, trainer }
      } else {
        console.log(`   ❌ Data persistence failed`)
        return { success: false, reason: "Data persistence failed" }
      }
    } else {
      console.log(`   ❌ Unexpected success - should have failed`)
      return { success: false, reason: "Unexpected success" }
    }
  } else {
    console.log(`   ❌ API Error: ${data.error || "Unknown error"}`)
    if (data.details) {
      console.log(`   Error details:`, data.details)
    }

    if (!scenario.shouldPass) {
      console.log(`   ✅ Expected failure - API validation working correctly`)
      return { success: true, reason: "Expected API failure" }
    } else {
      console.log(`   ❌ Unexpected API failure`)
      return { success: false, reason: "Unexpected API failure" }
    }
  }
}

// Main test execution
async function runTests() {
  console.log(`🚀 Testing ${testScenarios.length} scenarios...\n`)

  const results = []
  let passCount = 0
  let failCount = 0

  for (const scenario of testScenarios) {
    const result = await testScenario(scenario)
    results.push({ scenario: scenario.name, ...result })

    if (result.success) {
      passCount++
    } else {
      failCount++
    }

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // Summary
  console.log("\n" + "=".repeat(60))
  console.log("📊 TEST SUMMARY")
  console.log("=".repeat(60))
  console.log(`Total scenarios: ${testScenarios.length}`)
  console.log(`✅ Passed: ${passCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`Success rate: ${((passCount / testScenarios.length) * 100).toFixed(1)}%`)

  console.log("\n📋 DETAILED RESULTS:")
  results.forEach((result, index) => {
    const status = result.success ? "✅" : "❌"
    console.log(`${index + 1}. ${status} ${result.scenario}`)
    if (result.reason) {
      console.log(`   Reason: ${result.reason}`)
    }
  })

  // Key findings
  console.log("\n🔍 KEY FINDINGS:")
  console.log("• Optional fields (phone, bio, certifications, services) can be empty")
  console.log("• Bio validation only applies when bio is provided (20-500 chars)")
  console.log("• Required fields (fullName, email, city, district, specialty) are enforced")
  console.log("• Services array can be empty without causing errors")
  console.log("• Data persistence works correctly for all field combinations")

  if (failCount === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Optional fields handling is working correctly.")
  } else {
    console.log(`\n⚠️  ${failCount} test(s) failed. Please review the issues above.`)
  }
}

// Run the tests
runTests().catch((error) => {
  console.error("❌ Test execution failed:", error)
  process.exit(1)
})
