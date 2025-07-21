console.log("🧪 Testing Complete Form Submission Flow...\n")

// Comprehensive test data
const testCases = [
  {
    name: "Valid Complete Form",
    data: {
      fullName: "John Smith",
      email: "john.smith.test@example.com",
      phone: "+43 123 456 789",
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      bio: "I am a certified personal trainer with over 8 years of experience helping clients achieve their fitness goals. My approach focuses on sustainable lifestyle changes and personalized workout plans that fit your schedule and preferences.",
      certifications: "NASM-CPT, ACE Personal Trainer, Nutrition Specialist",
      services: ["Personal Training", "Weight Loss Programs", "Nutrition Coaching"],
    },
    shouldPass: true,
  },
  {
    name: "Minimal Valid Form (Required Only)",
    data: {
      fullName: "Jane Doe",
      email: "jane.doe.test@example.com",
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
    name: "Invalid Email Format",
    data: {
      fullName: "Invalid Email",
      email: "invalid-email",
      phone: "",
      city: "Graz",
      district: "Zentrum",
      specialty: "Sports Performance",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Missing Required Field (Name)",
    data: {
      fullName: "",
      email: "missing.name@example.com",
      phone: "",
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Rehabilitation",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Bio Too Short",
    data: {
      fullName: "Short Bio",
      email: "short.bio@example.com",
      phone: "",
      city: "Linz",
      district: "Zentrum",
      specialty: "Group Fitness",
      bio: "Too short bio",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Bio Too Long",
    data: {
      fullName: "Long Bio",
      email: "long.bio@example.com",
      phone: "",
      city: "Klagenfurt",
      district: "Zentrum",
      specialty: "Yoga & Mindfulness",
      bio: "A".repeat(501), // 501 characters
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
]

async function testFormSubmission(testCase) {
  console.log(`\n📝 Testing: ${testCase.name}`)
  console.log(`Expected to ${testCase.shouldPass ? "PASS" : "FAIL"}`)

  try {
    // Step 1: Submit form
    const response = await fetch("http://localhost:3000/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCase.data),
    })

    const result = await response.json()

    if (testCase.shouldPass) {
      if (response.ok && result.success) {
        console.log(`✅ Step 1 PASS: Form submitted successfully`)
        console.log(`   - Temp ID: ${result.tempId}`)
        console.log(`   - Redirect URL: ${result.redirectUrl}`)

        // Step 2: Verify data retrieval
        if (result.tempId) {
          const retrieveResponse = await fetch(`http://localhost:3000/api/trainer/temp/${result.tempId}`)
          const retrieveResult = await retrieveResponse.json()

          if (retrieveResponse.ok && retrieveResult.success) {
            console.log(`✅ Step 2 PASS: Data retrieval successful`)

            const trainer = retrieveResult.trainer
            console.log(`   - Name: ${trainer.fullName}`)
            console.log(`   - Email: ${trainer.email}`)
            console.log(`   - Location: ${trainer.city}, ${trainer.district}`)
            console.log(`   - Specialty: ${trainer.specialty}`)
            console.log(`   - Phone: ${trainer.phone || "Not provided"}`)
            console.log(`   - Bio Length: ${trainer.bio?.length || 0} chars`)
            console.log(`   - Certifications: ${trainer.certifications || "Not provided"}`)
            console.log(`   - Services: ${trainer.services?.length || 0} selected`)

            // Step 3: Test content generation
            const contentResponse = await fetch(`http://localhost:3000/api/trainer/content/${result.tempId}`)
            const contentResult = await contentResponse.json()

            if (contentResponse.ok && contentResult.success) {
              console.log(`✅ Step 3 PASS: Content generation successful`)
              console.log(`   - Generated ${Object.keys(contentResult.content).length} content sections`)

              // Verify content includes location properly
              const heroContent = contentResult.content.hero
              if (heroContent && heroContent.includes(trainer.city) && heroContent.includes(trainer.district)) {
                console.log(`✅ Step 4 PASS: Location properly integrated in content`)
              } else {
                console.log(`❌ Step 4 FAIL: Location not properly integrated`)
              }
            } else {
              console.log(`❌ Step 3 FAIL: Content generation failed: ${contentResult.error}`)
            }
          } else {
            console.log(`❌ Step 2 FAIL: Data retrieval failed: ${retrieveResult.error}`)
          }
        }
      } else {
        console.log(`❌ FAIL: Expected success but got error: ${result.error}`)
        if (result.details) {
          console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
        }
      }
    } else {
      if (!response.ok || !result.success) {
        console.log(`✅ PASS: Form correctly rejected with error: ${result.error}`)
        if (result.details) {
          console.log(`   Validation details: ${JSON.stringify(result.details, null, 2)}`)
        }
      } else {
        console.log(`❌ FAIL: Expected rejection but form was accepted`)
      }
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
  }
}

async function testEnvironmentSetup() {
  console.log("🔧 Testing Environment Setup...\n")

  try {
    // Test API endpoint availability
    const healthResponse = await fetch("http://localhost:3000/api/trainer/create", {
      method: "OPTIONS",
    })

    if (healthResponse.status === 200 || healthResponse.status === 405) {
      console.log("✅ API endpoint accessible")
    } else {
      console.log("❌ API endpoint not accessible")
      return false
    }

    // Test environment variables (indirectly)
    const testResponse = await fetch("http://localhost:3000/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Environment Test",
        email: "env.test@example.com",
        city: "Test City",
        district: "Test District",
        specialty: "Weight Loss",
        phone: "",
        bio: "",
        certifications: "",
        services: [],
      }),
    })

    const testResult = await testResponse.json()

    if (testResult.error && testResult.error.includes("Firebase")) {
      console.log("❌ Firebase configuration issue detected")
      return false
    }

    console.log("✅ Environment setup appears correct")
    return true
  } catch (error) {
    console.log(`❌ Environment setup error: ${error.message}`)
    return false
  }
}

async function runCompleteTests() {
  console.log("🚀 Starting Complete Form Submission Flow Tests\n")
  console.log("=".repeat(80))

  // Test environment first
  const envOk = await testEnvironmentSetup()
  if (!envOk) {
    console.log("\n❌ Environment setup failed. Please check your configuration.")
    return
  }

  console.log("\n" + "=".repeat(80))
  console.log("📋 Running Form Submission Tests...\n")

  let passCount = 0
  let failCount = 0

  for (const testCase of testCases) {
    await testFormSubmission(testCase)

    if (testCase.shouldPass) {
      passCount++
    } else {
      failCount++
    }

    // Wait between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log("\n" + "=".repeat(80))
  console.log("🏁 Complete Form Submission Tests Finished")
  console.log(`\n📊 Test Summary:`)
  console.log(`   - Total test cases: ${testCases.length}`)
  console.log(`   - Expected passes: ${testCases.filter((t) => t.shouldPass).length}`)
  console.log(`   - Expected failures: ${testCases.filter((t) => !t.shouldPass).length}`)

  console.log("\n🔍 Key Validations Tested:")
  console.log("   ✅ Required field validation")
  console.log("   ✅ Email format validation")
  console.log("   ✅ Bio length validation (when provided)")
  console.log("   ✅ Optional field handling")
  console.log("   ✅ Data persistence")
  console.log("   ✅ Content generation")
  console.log("   ✅ Location field integration")

  console.log("\n💡 Field Requirements:")
  console.log("   - Required: fullName, email, city, district, specialty")
  console.log("   - Optional: phone, bio, certifications, services")
  console.log("   - Bio validation: 20-500 chars (only when provided)")
  console.log("   - Services: can be empty array")
}

// Run the complete test suite
runCompleteTests().catch(console.error)
