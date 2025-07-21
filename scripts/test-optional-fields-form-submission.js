console.log("🧪 Testing Optional Fields Form Submission Flow...\n")

// Test data configurations
const testConfigurations = [
  {
    name: "Required Fields Only",
    data: {
      fullName: "John Smith",
      email: "john.smith@example.com",
      city: "Vienna",
      district: "Innere Stadt",
      specialty: "Weight Loss",
      phone: "",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Phone Only",
    data: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      city: "Salzburg",
      district: "Altstadt",
      specialty: "Strength Training",
      phone: "+43 123 456 789",
      bio: "",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Bio Only",
    data: {
      fullName: "Mike Johnson",
      email: "mike.johnson@example.com",
      city: "Graz",
      district: "Innere Stadt",
      specialty: "Sports Performance",
      phone: "",
      bio: "I am a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals.",
      certifications: "",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Certifications Only",
    data: {
      fullName: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      city: "Innsbruck",
      district: "Altstadt",
      specialty: "Nutrition Coaching",
      phone: "",
      bio: "",
      certifications: "NASM-CPT, ACE Personal Trainer",
      services: [],
    },
    shouldPass: true,
  },
  {
    name: "Required + Services Only",
    data: {
      fullName: "Tom Brown",
      email: "tom.brown@example.com",
      city: "Linz",
      district: "Zentrum",
      specialty: "Group Fitness",
      phone: "",
      bio: "",
      certifications: "",
      services: ["Personal Training", "Group Fitness"],
    },
    shouldPass: true,
  },
  {
    name: "All Fields Filled",
    data: {
      fullName: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      city: "Klagenfurt",
      district: "Zentrum",
      specialty: "Yoga & Mindfulness",
      phone: "+43 987 654 321",
      bio: "Experienced yoga instructor and mindfulness coach with a passion for helping clients find balance in their lives through movement and meditation.",
      certifications: "RYT-500, Mindfulness Coach Certification",
      services: ["Personal Training", "Yoga & Mindfulness", "Online Coaching"],
    },
    shouldPass: true,
  },
  {
    name: "Bio Too Short (Should Fail)",
    data: {
      fullName: "Alex Short",
      email: "alex.short@example.com",
      city: "Bregenz",
      district: "Zentrum",
      specialty: "Senior Fitness",
      phone: "",
      bio: "Too short",
      certifications: "",
      services: [],
    },
    shouldPass: false,
  },
  {
    name: "Missing Required City (Should Fail)",
    data: {
      fullName: "Missing City",
      email: "missing.city@example.com",
      city: "",
      district: "Some District",
      specialty: "Bodybuilding",
      phone: "+43 111 222 333",
      bio: "This should fail because city is missing even though other fields are filled.",
      certifications: "IFBB Pro Card",
      services: ["Strength Training", "Bodybuilding"],
    },
    shouldPass: false,
  },
]

async function testFormSubmission(config) {
  console.log(`\n📝 Testing: ${config.name}`)
  console.log(`Expected to ${config.shouldPass ? "PASS" : "FAIL"}`)

  try {
    const response = await fetch("http://localhost:3000/api/trainer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config.data),
    })

    const result = await response.json()

    if (config.shouldPass) {
      if (response.ok && result.success) {
        console.log(`✅ PASS: Form submitted successfully`)
        console.log(`   - Temp ID: ${result.tempId}`)
        console.log(`   - Redirect URL: ${result.redirectUrl}`)

        // Test data persistence
        if (result.tempId) {
          const checkResponse = await fetch(`http://localhost:3000/api/trainer/temp/${result.tempId}`)
          const checkResult = await checkResponse.json()

          if (checkResponse.ok && checkResult.success) {
            console.log(`✅ Data persistence verified`)

            // Check optional fields handling
            const trainer = checkResult.trainer
            console.log(`   - Phone: ${trainer.phone || "empty"}`)
            console.log(`   - Bio: ${trainer.bio ? `${trainer.bio.substring(0, 50)}...` : "empty"}`)
            console.log(`   - Certifications: ${trainer.certifications || "empty"}`)
            console.log(`   - Services: ${trainer.services?.length || 0} selected`)
          } else {
            console.log(`❌ Data persistence check failed`)
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

async function runOptionalFieldsTests() {
  console.log("🚀 Starting Optional Fields Form Submission Tests\n")
  console.log("=".repeat(60))

  for (const config of testConfigurations) {
    await testFormSubmission(config)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second between tests
  }

  console.log("\n" + "=".repeat(60))
  console.log("🏁 Optional Fields Tests Complete")
  console.log("\nKey Findings:")
  console.log("- Required fields: fullName, email, city, district, specialty")
  console.log("- Optional fields: phone, bio, certifications, services")
  console.log("- Bio validates only when provided (20-500 characters)")
  console.log("- Services can be empty array")
  console.log("- All optional fields can be empty strings")
}

// Run the tests
runOptionalFieldsTests().catch(console.error)
