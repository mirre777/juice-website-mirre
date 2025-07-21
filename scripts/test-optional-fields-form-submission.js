console.log("=== TESTING OPTIONAL FIELDS FORM SUBMISSION ===")
console.log("Testing form submission with various optional field combinations")
console.log("Test timestamp:", new Date().toISOString())

// Test cases specifically focused on optional fields
const optionalFieldTestCases = [
  {
    name: "All Required Fields Only (No Optional Fields)",
    data: {
      fullName: "John Minimal",
      email: "john.minimal@example.com",
      phone: "", // Optional - empty
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "", // Optional - empty
      certifications: "", // Optional - empty
      services: [], // Optional - empty array
    },
    shouldPass: true,
    description: "Should pass with only required fields filled",
  },
  {
    name: "Required + Phone Only",
    data: {
      fullName: "Jane Phone",
      email: "jane.phone@example.com",
      phone: "+43 123 456 7890", // Optional - filled
      city: "Salzburg",
      district: "Altstadt",
      specialty: "Strength Training",
      bio: "", // Optional - empty
      certifications: "", // Optional - empty
      services: [], // Optional - empty array
    },
    shouldPass: true,
    description: "Should pass with phone filled but other optionals empty",
  },
  {
    name: "Required + Bio Only",
    data: {
      fullName: "Mike Bio",
      email: "mike.bio@example.com",
      phone: "", // Optional - empty
      city: "Graz",
      district: "Zentrum",
      specialty: "Sports Performance",
      bio: "I am a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals through personalized training programs.", // Optional - filled
      certifications: "", // Optional - empty
      services: [], // Optional - empty array
    },
    shouldPass: true,
    description: "Should pass with bio filled but other optionals empty",
  },
  {
    name: "Required + Certifications Only",
    data: {
      fullName: "Sarah Certs",
      email: "sarah.certs@example.com",
      phone: "", // Optional - empty
      city: "Linz",
      district: "Zentrum",
      specialty: "Rehabilitation",
      bio: "", // Optional - empty
      certifications: "NASM-CPT, Physical Therapy License", // Optional - filled
      services: [], // Optional - empty array
    },
    shouldPass: true,
    description: "Should pass with certifications filled but other optionals empty",
  },
  {
    name: "Required + Services Only",
    data: {
      fullName: "Tom Services",
      email: "tom.services@example.com",
      phone: "", // Optional - empty
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Group Fitness",
      bio: "", // Optional - empty
      certifications: "", // Optional - empty
      services: ["Personal Training", "Group Fitness", "Nutrition Coaching"], // Optional - filled
    },
    shouldPass: true,
    description: "Should pass with services filled but other optionals empty",
  },
  {
    name: "All Fields Filled",
    data: {
      fullName: "Complete Trainer",
      email: "complete.trainer@example.com",
      phone: "+43 987 654 3210", // Optional - filled
      city: "Klagenfurt",
      district: "Zentrum",
      specialty: "Nutrition Coaching",
      bio: "Experienced nutrition coach and personal trainer specializing in sustainable lifestyle changes and evidence-based fitness programs.", // Optional - filled
      certifications: "NASM-CPT, Precision Nutrition Level 1, ACE Personal Trainer", // Optional - filled
      services: ["Personal Training", "Nutrition Coaching", "Online Coaching", "Weight Loss Programs"], // Optional - filled
    },
    shouldPass: true,
    description: "Should pass with all fields filled",
  },
  {
    name: "Bio Too Short (Should Fail)",
    data: {
      fullName: "Short Bio",
      email: "short.bio@example.com",
      phone: "+43 111 222 3333",
      city: "Bregenz",
      district: "Zentrum",
      specialty: "Yoga & Mindfulness",
      bio: "Too short", // Optional but invalid if provided
      certifications: "Yoga Alliance RYT-200",
      services: [],
    },
    shouldPass: false,
    description: "Should fail because bio is provided but too short",
  },
  {
    name: "Missing Required City (Should Fail)",
    data: {
      fullName: "No City",
      email: "no.city@example.com",
      phone: "+43 444 555 6666",
      city: "", // Required - missing
      district: "Some District",
      specialty: "Senior Fitness",
      bio: "Experienced trainer working with senior clients to improve mobility and strength.",
      certifications: "Senior Fitness Specialist",
      services: ["Personal Training"],
    },
    shouldPass: false,
    description: "Should fail because required city field is missing",
  },
]

// Validation function (matches the frontend logic)
function validateFormData(data) {
  const errors = []

  // Required field validations
  if (!data.fullName?.trim()) {
    errors.push("Full name is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format")
  }

  if (!data.city?.trim()) {
    errors.push("City is required")
  }

  if (!data.district?.trim()) {
    errors.push("District is required")
  }

  if (!data.specialty) {
    errors.push("Primary specialty is required")
  }

  // Optional bio validation - only validate if provided
  if (data.bio?.trim() && data.bio.trim().length < 20) {
    errors.push("Bio must be at least 20 characters if provided")
  }

  if (data.bio?.trim() && data.bio.trim().length > 500) {
    errors.push("Bio must be less than 500 characters")
  }

  // Phone, certifications, and services are optional with no validation

  return errors
}

// Test API endpoint with detailed logging
async function testOptionalFieldsAPI(testData) {
  try {
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Testing: ${testData.name}`)
    console.log(`Description: ${testData.description}`)
    console.log(`Expected to pass: ${testData.shouldPass}`)

    // Log which fields are filled vs empty
    console.log("\nField Analysis:")
    console.log(`  Required Fields:`)
    console.log(`    - fullName: "${testData.data.fullName}" ${testData.data.fullName ? "✓" : "✗"}`)
    console.log(`    - email: "${testData.data.email}" ${testData.data.email ? "✓" : "✗"}`)
    console.log(`    - city: "${testData.data.city}" ${testData.data.city ? "✓" : "✗"}`)
    console.log(`    - district: "${testData.data.district}" ${testData.data.district ? "✓" : "✗"}`)
    console.log(`    - specialty: "${testData.data.specialty}" ${testData.data.specialty ? "✓" : "✗"}`)

    console.log(`  Optional Fields:`)
    console.log(`    - phone: "${testData.data.phone}" ${testData.data.phone ? "✓" : "(empty)"}`)
    console.log(
      `    - bio: "${testData.data.bio?.substring(0, 30)}${testData.data.bio?.length > 30 ? "..." : ""}" ${testData.data.bio ? `✓ (${testData.data.bio.length} chars)` : "(empty)"}`,
    )
    console.log(
      `    - certifications: "${testData.data.certifications}" ${testData.data.certifications ? "✓" : "(empty)"}`,
    )
    console.log(
      `    - services: [${testData.data.services?.join(", ")}] ${testData.data.services?.length > 0 ? `✓ (${testData.data.services.length} items)` : "(empty)"}`,
    )

    // Client-side validation test
    const validationErrors = validateFormData(testData.data)
    console.log(`\nClient-side validation: ${validationErrors.length === 0 ? "✅ PASSED" : "❌ FAILED"}`)
    if (validationErrors.length > 0) {
      console.log(`  Validation errors: ${validationErrors.join(", ")}`)
    }

    // API call
    console.log("\nMaking API request...")
    const response = await fetch("/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData.data),
    })

    console.log(`Response status: ${response.status}`)
    console.log(`Response ok: ${response.ok}`)

    const responseData = await response.json()
    console.log("Response data:", JSON.stringify(responseData, null, 2))

    const apiSuccess = response.ok && responseData.success
    const expectedResult = testData.shouldPass

    // Result analysis
    if (apiSuccess === expectedResult) {
      console.log(`\n🎉 TEST RESULT: ✅ PASSED`)
      console.log(`   Expected: ${expectedResult ? "SUCCESS" : "FAILURE"}`)
      console.log(`   Got: ${apiSuccess ? "SUCCESS" : "FAILURE"}`)

      if (apiSuccess && responseData.tempId) {
        console.log(`   Temp ID generated: ${responseData.tempId}`)
        console.log(`   Redirect URL: ${responseData.redirectUrl}`)
        return { passed: true, tempId: responseData.tempId, apiSuccess: true }
      }
      return { passed: true, tempId: null, apiSuccess: false }
    } else {
      console.log(`\n💥 TEST RESULT: ❌ FAILED`)
      console.log(`   Expected: ${expectedResult ? "SUCCESS" : "FAILURE"}`)
      console.log(`   Got: ${apiSuccess ? "SUCCESS" : "FAILURE"}`)

      if (!expectedResult && apiSuccess) {
        console.log("   ⚠️ This test should have failed but passed!")
      } else if (expectedResult && !apiSuccess) {
        console.log("   ⚠️ This test should have passed but failed!")
        console.log(`   API Error: ${responseData.error}`)
        if (responseData.details) {
          console.log(`   Details: ${responseData.details}`)
        }
      }
      return { passed: false, tempId: null, apiSuccess }
    }
  } catch (error) {
    console.error(`\n💥 API ERROR for ${testData.name}:`, error)
    return { passed: false, tempId: null, apiSuccess: false, error: error.message }
  }
}

// Test temp trainer retrieval for successful cases
async function testTempTrainerData(tempId, testName) {
  if (!tempId) {
    console.log(`\n⏭️ Skipping temp trainer data check for ${testName} (no tempId)`)
    return false
  }

  try {
    console.log(`\n--- Checking Temp Trainer Data for: ${testName} ---`)

    const response = await fetch(`/api/trainer/temp/${tempId}`)
    console.log(`Retrieval status: ${response.status}`)

    if (!response.ok) {
      console.log("❌ Failed to retrieve temp trainer")
      return false
    }

    const data = await response.json()

    if (data.success && data.trainer) {
      console.log("✅ Temp trainer retrieved successfully")
      console.log("Stored data analysis:")
      console.log(`  - Name: ${data.trainer.fullName}`)
      console.log(`  - Email: ${data.trainer.email}`)
      console.log(`  - Phone: ${data.trainer.phone || "(empty)"}`)
      console.log(`  - Location: ${data.trainer.city}, ${data.trainer.district}`)
      console.log(`  - Specialty: ${data.trainer.specialty}`)
      console.log(`  - Bio: ${data.trainer.bio ? `${data.trainer.bio.substring(0, 50)}...` : "(empty)"}`)
      console.log(`  - Certifications: ${data.trainer.certifications || "(empty)"}`)
      console.log(`  - Services: ${data.trainer.services?.length > 0 ? data.trainer.services.join(", ") : "(empty)"}`)
      console.log(`  - Status: ${data.trainer.status}`)
      console.log(`  - Content generated: ${data.trainer.content ? "✓" : "✗"}`)

      return true
    } else {
      console.log("❌ Invalid response structure")
      return false
    }
  } catch (error) {
    console.error(`❌ Error retrieving temp trainer for ${testName}:`, error)
    return false
  }
}

// Main test execution
async function runOptionalFieldsTest() {
  console.log("Starting optional fields form submission test...")
  console.log(`Testing ${optionalFieldTestCases.length} different scenarios\n`)

  const results = {
    tests: [],
    summary: {
      total: optionalFieldTestCases.length,
      passed: 0,
      failed: 0,
      apiSuccesses: 0,
      tempRetrievals: 0,
    },
  }

  // Run all test cases
  for (let i = 0; i < optionalFieldTestCases.length; i++) {
    const testCase = optionalFieldTestCases[i]
    console.log(`\n📋 Running test ${i + 1}/${optionalFieldTestCases.length}`)

    const apiResult = await testOptionalFieldsAPI(testCase)

    // Test temp trainer retrieval for successful API calls
    let retrievalResult = null
    if (apiResult.apiSuccess && apiResult.tempId) {
      retrievalResult = await testTempTrainerData(apiResult.tempId, testCase.name)
      if (retrievalResult) {
        results.summary.tempRetrievals++
      }
    }

    results.tests.push({
      name: testCase.name,
      expected: testCase.shouldPass,
      apiPassed: apiResult.passed,
      apiSuccess: apiResult.apiSuccess,
      tempId: apiResult.tempId,
      retrievalSuccess: retrievalResult,
      error: apiResult.error,
    })

    if (apiResult.passed) {
      results.summary.passed++
    } else {
      results.summary.failed++
    }

    if (apiResult.apiSuccess) {
      results.summary.apiSuccesses++
    }

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Final summary
  console.log(`\n${"=".repeat(80)}`)
  console.log("🏁 FINAL TEST RESULTS SUMMARY")
  console.log(`${"=".repeat(80)}`)

  console.log(`\n📊 Overall Statistics:`)
  console.log(`  Total tests: ${results.summary.total}`)
  console.log(`  Tests passed: ${results.summary.passed}`)
  console.log(`  Tests failed: ${results.summary.failed}`)
  console.log(`  API successes: ${results.summary.apiSuccesses}`)
  console.log(`  Temp retrievals: ${results.summary.tempRetrievals}`)
  console.log(`  Success rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`)

  console.log(`\n📋 Detailed Results:`)
  results.tests.forEach((test, index) => {
    const status = test.apiPassed ? "✅" : "❌"
    const apiStatus = test.apiSuccess ? "✅ API" : "❌ API"
    const retrievalStatus = test.retrievalSuccess ? "✅ DATA" : test.tempId ? "❌ DATA" : "⏭️ DATA"

    console.log(`  ${index + 1}. ${status} ${test.name}`)
    console.log(`     ${apiStatus} | ${retrievalStatus} | Expected: ${test.expected ? "PASS" : "FAIL"}`)
    if (test.error) {
      console.log(`     Error: ${test.error}`)
    }
  })

  // Key findings
  console.log(`\n🔍 KEY FINDINGS:`)

  const optionalOnlyTests = results.tests.filter(
    (t) => t.name.includes("Only") || t.name.includes("All Required Fields Only"),
  )
  const allOptionalPassed = optionalOnlyTests.every((t) => t.apiSuccess)

  console.log(`  ✓ Optional fields handling: ${allOptionalPassed ? "✅ WORKING" : "❌ ISSUES"}`)
  console.log(
    `  ✓ Required field validation: ${results.tests.find((t) => t.name.includes("Missing Required"))?.apiPassed === false ? "✅ WORKING" : "❌ ISSUES"}`,
  )
  console.log(
    `  ✓ Bio validation: ${results.tests.find((t) => t.name.includes("Bio Too Short"))?.apiPassed === false ? "✅ WORKING" : "❌ ISSUES"}`,
  )
  console.log(`  ✓ Data persistence: ${results.summary.tempRetrievals > 0 ? "✅ WORKING" : "❌ ISSUES"}`)

  if (results.summary.passed === results.summary.total) {
    console.log(`\n🎉 ALL TESTS PASSED! Optional fields are working correctly.`)
  } else {
    console.log(`\n⚠️ ${results.summary.failed} test(s) failed. Please review the issues above.`)
  }

  console.log(`\nTest completed at: ${new Date().toISOString()}`)
  return results
}

// Execute the test
runOptionalFieldsTest()
  .then((results) => {
    console.log("\n✨ Optional fields test execution completed!")
  })
  .catch((error) => {
    console.error("❌ Test execution failed:", error)
  })
