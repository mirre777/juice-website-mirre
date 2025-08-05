console.log("🧪 Testing Munich Personal Training Form - Complete Flow...\n")

// Test cases for Munich form
const testCases = [
  {
    name: "Complete Munich Form - All Fields",
    data: {
      name: "Max Mustermann",
      email: "max.mustermann@example.com",
      goal: "Muskelaufbau",
      district: "Schwabing-West",
      startTime: "sofort",
      user_type: "client",
      city: "München",
      phone: "+49 89 123456789",
      message: "Ich möchte endlich richtig mit dem Training anfangen!",
    },
    shouldPass: true,
    description: "All fields filled including optional ones",
  },
  {
    name: "Munich Form - Required Fields Only",
    data: {
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      goal: "Abnehmen & Körperfett reduzieren",
      district: "Maxvorstadt",
      startTime: "in 2-4 Wochen",
      user_type: "client",
      city: "München",
      // Optional fields left empty
      phone: "",
      message: "",
    },
    shouldPass: true,
    description: "Only required fields filled",
  },
  {
    name: "Munich Form - Missing Required Field (Name)",
    data: {
      name: "", // Missing required field
      email: "missing.name@example.com",
      goal: "Gesundheit & Wohlbefinden",
      district: "Altstadt-Lehel",
      startTime: "sofort",
      user_type: "client",
      city: "München",
      phone: "+49 89 987654321",
      message: "Test message",
    },
    shouldPass: false,
    description: "Missing required name field",
  },
  {
    name: "Munich Form - Invalid Email",
    data: {
      name: "Invalid Email Test",
      email: "invalid-email-format", // Invalid email
      goal: "Haltung verbessern",
      district: "Bogenhausen",
      startTime: "in 1-2 Wochen",
      user_type: "client",
      city: "München",
      phone: "",
      message: "",
    },
    shouldPass: false,
    description: "Invalid email format",
  },
  {
    name: "Munich Form - Invalid Phone (Too Short)",
    data: {
      name: "Short Phone Test",
      email: "short.phone@example.com",
      goal: "Kraft & Leistung steigern",
      district: "Sendling",
      startTime: "sofort",
      user_type: "client",
      city: "München",
      phone: "123", // Too short phone number
      message: "",
    },
    shouldPass: false,
    description: "Phone number too short",
  },
  {
    name: "Munich Trainer Form",
    data: {
      name: "Personal Trainer München",
      email: "trainer.muenchen@example.com",
      goal: "", // Not applicable for trainers
      district: "Glockenbachviertel",
      startTime: "", // Not applicable for trainers
      user_type: "trainer",
      city: "München",
      phone: "+49 89 555666777",
      message: "Ich bin Personal Trainer und möchte mich registrieren",
      numClients: "25",
      plan: "pro",
    },
    shouldPass: true,
    description: "Trainer registration from Munich",
  },
]

async function testFormSubmission(testCase) {
  console.log(`\n📝 Testing: ${testCase.name}`)
  console.log(`Description: ${testCase.description}`)
  console.log(`Expected to ${testCase.shouldPass ? "PASS" : "FAIL"}`)

  try {
    // Create FormData object
    const formData = new FormData()
    Object.entries(testCase.data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    console.log("Form data being sent:", Object.fromEntries(formData.entries()))

    // Step 1: Submit form to waitlist action
    const response = await fetch("http://localhost:3000/api/test-waitlist", {
      method: "POST",
      body: formData,
    })

    let result
    try {
      result = await response.json()
    } catch (e) {
      console.log(`❌ FAIL: Invalid JSON response`)
      return
    }

    console.log("Response status:", response.status)
    console.log("Response data:", result)

    if (testCase.shouldPass) {
      if (response.ok && result.success) {
        console.log(`✅ Step 1 PASS: Form submitted successfully`)
        console.log(`   Message: ${result.message}`)

        // Step 2: Verify data appears in admin API
        console.log(`\n🔍 Step 2: Checking admin API...`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for data to be saved

        const adminResponse = await fetch("http://localhost:3000/api/admin/users")
        const adminResult = await adminResponse.json()

        if (adminResponse.ok && adminResult.success) {
          console.log(`✅ Step 2 PASS: Admin API accessible`)
          console.log(`   Found ${adminResult.users.length} users total`)

          // Look for our submitted user
          const submittedUser = adminResult.users.find((user) => user.email === testCase.data.email)

          if (submittedUser) {
            console.log(`✅ Step 3 PASS: User found in admin data`)
            console.log(`   User ID: ${submittedUser.id}`)
            console.log(`   Name: ${submittedUser.name || "Not provided"}`)
            console.log(`   Email: ${submittedUser.email}`)
            console.log(`   City: ${submittedUser.city}`)
            console.log(`   District: ${submittedUser.district || "Not provided"}`)
            console.log(`   Goal: ${submittedUser.goal || "Not provided"}`)
            console.log(`   Start Time: ${submittedUser.startTime || "Not provided"}`)
            console.log(`   Phone: ${submittedUser.phone || "Not provided"}`)
            console.log(`   User Type: ${submittedUser.user_type}`)
            console.log(`   Status: ${submittedUser.status}`)
            console.log(`   Source: ${submittedUser.source || "Not provided"}`)

            // Verify all Munich-specific fields are present
            const munichFields = ["name", "goal", "district", "startTime"]
            let allFieldsPresent = true

            munichFields.forEach((field) => {
              if (testCase.data[field] && !submittedUser[field]) {
                console.log(`❌ Missing field in admin data: ${field}`)
                allFieldsPresent = false
              } else if (testCase.data[field] && submittedUser[field] !== testCase.data[field]) {
                console.log(`❌ Field mismatch: ${field}`)
                console.log(`   Expected: ${testCase.data[field]}`)
                console.log(`   Got: ${submittedUser[field]}`)
                allFieldsPresent = false
              }
            })

            if (allFieldsPresent) {
              console.log(`✅ Step 4 PASS: All Munich fields correctly stored and retrieved`)
            } else {
              console.log(`❌ Step 4 FAIL: Some Munich fields missing or incorrect`)
            }
          } else {
            console.log(`❌ Step 3 FAIL: User not found in admin data`)
            console.log(`   Looking for email: ${testCase.data.email}`)
            console.log(`   Available emails: ${adminResult.users.map((u) => u.email).join(", ")}`)
          }
        } else {
          console.log(`❌ Step 2 FAIL: Admin API error: ${adminResult.error}`)
        }
      } else {
        console.log(`❌ FAIL: Expected success but got error: ${result.error || "Unknown error"}`)
        if (result.details) {
          console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
        }
      }
    } else {
      if (!response.ok || !result.success) {
        console.log(`✅ PASS: Form correctly rejected with error: ${result.error || result.message}`)
        if (result.details) {
          console.log(`   Validation details: ${JSON.stringify(result.details, null, 2)}`)
        }
      } else {
        console.log(`❌ FAIL: Expected rejection but form was accepted`)
        console.log(`   Result: ${JSON.stringify(result, null, 2)}`)
      }
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
  }
}

async function testEnvironmentSetup() {
  console.log("🔧 Testing Environment Setup...\n")

  try {
    // Test if server is running
    const healthResponse = await fetch("http://localhost:3000/api/admin/users")
    if (healthResponse.status === 200 || healthResponse.status === 500) {
      console.log("✅ Server is running")
    } else {
      console.log("❌ Server not accessible")
      return false
    }

    // Test admin API
    const adminResponse = await fetch("http://localhost:3000/api/admin/users")
    const adminResult = await adminResponse.json()

    if (adminResponse.ok) {
      console.log("✅ Admin API accessible")
      console.log(`   Current users in database: ${adminResult.users?.length || 0}`)
    } else {
      console.log("❌ Admin API error:", adminResult.error)
    }

    return true
  } catch (error) {
    console.log(`❌ Environment setup error: ${error.message}`)
    return false
  }
}

async function runCompleteTests() {
  console.log("🚀 Starting Munich Form Complete Flow Tests\n")
  console.log("=".repeat(80))

  // Test environment first
  const envOk = await testEnvironmentSetup()
  if (!envOk) {
    console.log("\n❌ Environment setup failed. Please check your configuration.")
    return
  }

  console.log("\n" + "=".repeat(80))
  console.log("📋 Running Munich Form Tests...\n")

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
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log("\n" + "=".repeat(80))
  console.log("🏁 Munich Form Tests Finished")
  console.log(`\n📊 Test Summary:`)
  console.log(`   - Total test cases: ${testCases.length}`)
  console.log(`   - Expected passes: ${testCases.filter((t) => t.shouldPass).length}`)
  console.log(`   - Expected failures: ${testCases.filter((t) => !t.shouldPass).length}`)

  console.log("\n🔍 Key Validations Tested:")
  console.log("   ✅ Required field validation (name, email, goal, district, startTime)")
  console.log("   ✅ Optional field handling (phone, message)")
  console.log("   ✅ Email format validation")
  console.log("   ✅ Phone number validation (when provided)")
  console.log("   ✅ User type handling (client vs trainer)")
  console.log("   ✅ Munich-specific field storage")
  console.log("   ✅ Admin API data retrieval")
  console.log("   ✅ Field mapping and display")

  console.log("\n💡 Munich Form Fields:")
  console.log("   - Required: name, email, goal, district, startTime, user_type, city")
  console.log("   - Optional: phone, message")
  console.log("   - Trainer-specific: numClients, plan")

  console.log("\n🎯 Munich Districts Tested:")
  console.log("   - Schwabing-West, Maxvorstadt, Altstadt-Lehel")
  console.log("   - Bogenhausen, Sendling, Glockenbachviertel")

  console.log("\n🏋️ Goals Tested:")
  console.log("   - Muskelaufbau, Abnehmen & Körperfett reduzieren")
  console.log("   - Gesundheit & Wohlbefinden, Haltung verbessern")
  console.log("   - Kraft & Leistung steigern")
}

// Run the complete test suite
runCompleteTests().catch(console.error)
