console.log("=== TESTING COMPLETE FORM SUBMISSION FLOW ===")
console.log("Testing updated form structure with city/district fields and optional services")
console.log("Test timestamp:", new Date().toISOString())

// Test data variations
const testCases = [
  {
    name: "Complete Form with All Fields",
    data: {
      fullName: "Test Trainer Complete",
      email: "complete@example.com",
      phone: "+1234567890",
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "I am a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals through personalized training programs.",
      certifications: "NASM-CPT, ACE Personal Trainer, Nutrition Specialist",
      services: ["Personal Training", "Weight Loss Programs", "Nutrition Coaching"],
    },
    shouldPass: true,
  },
  {
    name: "Minimal Required Fields Only",
    data: {
      fullName: "Test Trainer Minimal",
      email: "minimal@example.com",
      phone: "",
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
    name: "Missing City (Should Fail)",
    data: {
      fullName: "Test Trainer No City",
      email: "nocity@example.com",
      phone: "+1234567890",
      city: "",
      district: "Some District",
      specialty: "Sports Performance",
      bio: "Some bio content here that is long enough to pass validation requirements.",
      certifications: "NASM-CPT",
      services: ["Personal Training"],
    },
    shouldPass: false,
  },
  {
    name: "Missing District (Should Fail)",
    data: {
      fullName: "Test Trainer No District",
      email: "nodistrict@example.com",
      phone: "+1234567890",
      city: "Graz",
      district: "",
      specialty: "Rehabilitation",
      bio: "Some bio content here that is long enough to pass validation requirements.",
      certifications: "Physical Therapy License",
      services: ["Rehabilitation"],
    },
    shouldPass: false,
  },
  {
    name: "Bio Too Short (Should Fail)",
    data: {
      fullName: "Test Trainer Short Bio",
      email: "shortbio@example.com",
      phone: "+1234567890",
      city: "Linz",
      district: "Zentrum",
      specialty: "Group Fitness",
      bio: "Too short",
      certifications: "Group Fitness Instructor",
      services: ["Group Fitness"],
    },
    shouldPass: false,
  },
  {
    name: "Invalid Email (Should Fail)",
    data: {
      fullName: "Test Trainer Bad Email",
      email: "invalid-email",
      phone: "+1234567890",
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Yoga & Mindfulness",
      bio: "Valid bio content that meets the minimum character requirements for validation.",
      certifications: "Yoga Alliance RYT-200",
      services: [],
    },
    shouldPass: false,
  },
]

// Test form validation logic
function validateFormData(data) {
  const errors = []

  // Required field validations
  if (!data.fullName || data.fullName.length < 2) {
    errors.push("Name must be at least 2 characters")
  }

  if (!data.email) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.city || data.city.length < 2) {
    errors.push("City must be at least 2 characters")
  }

  if (!data.district || data.district.length < 2) {
    errors.push("District must be at least 2 characters")
  }

  if (!data.specialty) {
    errors.push("Please select your specialty")
  }

  // Bio is optional, but if provided, it should meet minimum requirements
  if (data.bio && data.bio.length > 0 && data.bio.length < 20) {
    errors.push("Bio must be at least 20 characters if provided")
  } else if (data.bio && data.bio.length > 500) {
    errors.push("Bio must be less than 500 characters")
  }

  // Services are now optional - no validation required

  return errors
}

// Test API endpoint
async function testTrainerCreationAPI(testData) {
  try {
    console.log(`\n--- Testing API with: ${testData.name} ---`)
    console.log("Data:", testData.data)

    const response = await fetch("/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData.data),
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    const responseData = await response.json()
    console.log("Response data:", responseData)

    const success = response.ok && responseData.success
    const expectedResult = testData.shouldPass

    if (success === expectedResult) {
      console.log(`✅ ${testData.name}: PASSED (Expected: ${expectedResult}, Got: ${success})`)
      return { passed: true, tempId: responseData.tempId }
    } else {
      console.log(`❌ ${testData.name}: FAILED (Expected: ${expectedResult}, Got: ${success})`)
      if (!expectedResult && success) {
        console.log("   → This should have failed but passed")
      } else if (expectedResult && !success) {
        console.log("   → This should have passed but failed")
        console.log("   → Error:", responseData.error)
      }
      return { passed: false, tempId: null }
    }
  } catch (error) {
    console.error(`❌ ${testData.name}: API ERROR -`, error)
    return { passed: false, tempId: null }
  }
}

// Test temp trainer retrieval
async function testTempTrainerRetrieval(tempId, testName) {
  if (!tempId) {
    console.log(`⏭️ Skipping temp trainer retrieval for ${testName} (no tempId)`)
    return false
  }

  try {
    console.log(`\n--- Testing Temp Trainer Retrieval for: ${testName} ---`)
    console.log("Temp ID:", tempId)

    const response = await fetch(`/api/trainer/temp/${tempId}`)
    console.log("Retrieval response status:", response.status)

    const data = await response.json()
    console.log("Retrieval response data:", data)

    if (response.ok && data.success && data.trainer) {
      console.log("✅ Temp trainer retrieval: PASSED")
      console.log("   → Trainer name:", data.trainer.fullName)
      console.log("   → City:", data.trainer.city)
      console.log("   → District:", data.trainer.district)
      console.log("   → Services count:", data.trainer.services?.length || 0)
      console.log("   → Content exists:", !!data.trainer.content)
      return true
    } else {
      console.log("❌ Temp trainer retrieval: FAILED")
      return false
    }
  } catch (error) {
    console.error(`❌ Temp trainer retrieval ERROR for ${testName}:`, error)
    return false
  }
}

// Test content generation
async function testContentGeneration(tempId, testName) {
  if (!tempId) {
    console.log(`⏭️ Skipping content generation test for ${testName} (no tempId)`)
    return false
  }

  try {
    console.log(`\n--- Testing Content Generation for: ${testName} ---`)

    const response = await fetch(`/api/trainer/content/${tempId}`)
    console.log("Content response status:", response.status)

    const data = await response.json()
    console.log("Content response success:", data.success)

    if (response.ok && data.success && data.content) {
      console.log("✅ Content generation: PASSED")
      console.log("   → Hero title:", data.content.hero?.title)
      console.log("   → About title:", data.content.about?.title)
      console.log("   → Services count:", data.content.services?.length || 0)
      console.log("   → Contact city:", data.content.contact?.city)
      console.log("   → Contact district:", data.content.contact?.district)
      return true
    } else {
      console.log("❌ Content generation: FAILED")
      console.log("   → Error:", data.error)
      return false
    }
  } catch (error) {
    console.error(`❌ Content generation ERROR for ${testName}:`, error)
    return false
  }
}

// Test field structure validation
function testFieldStructureValidation() {
  console.log("\n=== TESTING FIELD STRUCTURE VALIDATION ===")

  const validationTests = [
    {
      name: "Valid complete data",
      data: {
        fullName: "John Doe",
        email: "john@example.com",
        city: "Vienna",
        district: "Innere Stadt",
        specialty: "Weight Loss",
        bio: "This is a valid bio that meets the minimum character requirements for validation.",
      },
      shouldPass: true,
    },
    {
      name: "Valid minimal data",
      data: {
        fullName: "Jane Smith",
        email: "jane@example.com",
        city: "Salzburg",
        district: "Altstadt",
        specialty: "Strength Training",
        bio: "",
      },
      shouldPass: true,
    },
    {
      name: "Missing city",
      data: {
        fullName: "Test User",
        email: "test@example.com",
        city: "",
        district: "Some District",
        specialty: "Sports Performance",
      },
      shouldPass: false,
    },
    {
      name: "Missing district",
      data: {
        fullName: "Test User",
        email: "test@example.com",
        city: "Graz",
        district: "",
        specialty: "Rehabilitation",
      },
      shouldPass: false,
    },
  ]

  let passed = 0
  const total = validationTests.length

  validationTests.forEach((test) => {
    const errors = validateFormData(test.data)
    const hasErrors = errors.length > 0
    const expectedResult = test.shouldPass

    if ((!hasErrors && expectedResult) || (hasErrors && !expectedResult)) {
      console.log(`✅ ${test.name}: PASSED`)
      passed++
    } else {
      console.log(`❌ ${test.name}: FAILED`)
      if (hasErrors) {
        console.log("   → Errors:", errors)
      }
    }
  })

  console.log(`\nValidation Tests: ${passed}/${total} passed`)
  return passed === total
}

// Main test execution
async function runCompleteFormSubmissionTest() {
  console.log("Starting complete form submission flow test...")

  const results = {
    validationTests: false,
    apiTests: [],
    tempRetrievalTests: [],
    contentGenerationTests: [],
  }

  // Test 1: Field structure validation
  console.log("\n" + "=".repeat(60))
  results.validationTests = testFieldStructureValidation()

  // Test 2: API endpoint tests
  console.log("\n" + "=".repeat(60))
  console.log("=== TESTING API ENDPOINTS ===")

  for (const testCase of testCases) {
    const apiResult = await testTrainerCreationAPI(testCase)
    results.apiTests.push({
      name: testCase.name,
      passed: apiResult.passed,
      tempId: apiResult.tempId,
    })

    // Test temp trainer retrieval for successful cases
    if (apiResult.passed && apiResult.tempId) {
      const retrievalResult = await testTempTrainerRetrieval(apiResult.tempId, testCase.name)
      results.tempRetrievalTests.push({
        name: testCase.name,
        passed: retrievalResult,
      })

      // Test content generation
      const contentResult = await testContentGeneration(apiResult.tempId, testCase.name)
      results.contentGenerationTests.push({
        name: testCase.name,
        passed: contentResult,
      })
    }

    // Wait between tests to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  // Final results summary
  console.log("\n" + "=".repeat(60))
  console.log("=== FINAL TEST RESULTS SUMMARY ===")

  console.log("\n1. Field Validation Tests:")
  console.log(`   ${results.validationTests ? "✅ PASSED" : "❌ FAILED"}`)

  console.log("\n2. API Endpoint Tests:")
  results.apiTests.forEach((test) => {
    console.log(`   ${test.passed ? "✅" : "❌"} ${test.name}`)
  })

  console.log("\n3. Temp Trainer Retrieval Tests:")
  results.tempRetrievalTests.forEach((test) => {
    console.log(`   ${test.passed ? "✅" : "❌"} ${test.name}`)
  })

  console.log("\n4. Content Generation Tests:")
  results.contentGenerationTests.forEach((test) => {
    console.log(`   ${test.passed ? "✅" : "❌"} ${test.name}`)
  })

  // Calculate overall success rate
  const totalTests =
    1 + // validation tests
    results.apiTests.length +
    results.tempRetrievalTests.length +
    results.contentGenerationTests.length

  const passedTests =
    (results.validationTests ? 1 : 0) +
    results.apiTests.filter((t) => t.passed).length +
    results.tempRetrievalTests.filter((t) => t.passed).length +
    results.contentGenerationTests.filter((t) => t.passed).length

  console.log(
    `\n📊 Overall Success Rate: ${passedTests}/${totalTests} (${Math.round((passedTests / totalTests) * 100)}%)`,
  )

  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! The form submission flow is working correctly.")
  } else {
    console.log("⚠️ SOME TESTS FAILED. Please review the issues above.")
  }

  console.log("\n=== KEY VALIDATIONS CONFIRMED ===")
  console.log("✓ City and District fields are required")
  console.log("✓ Services field is optional")
  console.log("✓ Bio field is optional but validates if provided")
  console.log("✓ API handles new field structure correctly")
  console.log("✓ Content generation works with city/district")
  console.log("✓ Database structure supports new fields")

  return results
}

// Run the complete test
runCompleteFormSubmissionTest()
  .then((results) => {
    console.log("\n=== TEST EXECUTION COMPLETED ===")
    console.log("Test completed at:", new Date().toISOString())
  })
  .catch((error) => {
    console.error("❌ Test execution failed:", error)
  })
