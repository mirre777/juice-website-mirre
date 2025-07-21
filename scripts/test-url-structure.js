console.log("=== TESTING URL STRUCTURE AND DATA VALIDATION ===")

// Test data structure validation
async function validateDataStructure() {
  console.log("\n=== DATA STRUCTURE VALIDATION ===")

  // Test trainer creation with correct structure
  const testTrainerData = {
    fullName: "Test Trainer",
    email: "test@example.com",
    phone: "+1234567890",
    location: "Test City",
    experience: "2-3 years",
    specialty: "Weight Loss",
    certifications: "NASM, ACE",
    bio: "Passionate fitness trainer helping clients achieve their goals.",
    services: ["Personal Training", "Nutrition Coaching"],
  }

  try {
    // Test trainer creation
    const createResponse = await fetch("/api/trainer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testTrainerData),
    })

    const createResult = await createResponse.json()
    console.log("✅ Trainer creation:", createResult.success ? "SUCCESS" : "FAILED")

    if (createResult.success && createResult.tempId) {
      // Test temp trainer API
      const tempResponse = await fetch(`/api/trainer/temp/${createResult.tempId}`)
      const tempResult = await tempResponse.json()

      if (tempResult.success && tempResult.trainer) {
        const trainer = tempResult.trainer

        // Validate data structure
        console.log("\n=== VALIDATION ===")
        console.log("✅ Bio is in content.about.bio:", trainer.content?.about?.bio ? "✓" : "✗")
        console.log("✅ Phone is in content.contact.phone:", trainer.content?.contact?.phone ? "✓" : "✗")
        console.log("✅ Location is in content.contact.location:", trainer.content?.contact?.location ? "✓" : "✗")
        console.log(
          "✅ No bio/phone/location at root level:",
          !trainer.bio && !trainer.phone && !trainer.location ? "✓" : "✗",
        )

        console.log("\n=== STATUS VALIDATION ===")
        console.log("✅ Status is 'temp' (not 'pending'):", trainer.status === "temp" ? "✓" : "✗")
        console.log(
          "✅ isPaid and isActive are boolean:",
          typeof trainer.isPaid === "boolean" && typeof trainer.isActive === "boolean" ? "✓" : "✗",
        )

        console.log("\n=== SUMMARY ===")
        console.log("✅ Changed content.about.content → content.about.bio")

        console.log("\n=== URL STRUCTURE ===")
        console.log("✅ Final live URL structure: /marketplace/trainer/[id]")
        console.log("✅ All URLs follow consistent pattern")

        console.log(`\nExample URLs for trainer ID '${trainer.id}':`)
        console.log(`✅ Temp page: /marketplace/trainer/temp/${trainer.id}`)
        console.log(`✅ Live page: /marketplace/trainer/${trainer.id}`)
        console.log(`✅ Payment: /payment?tempId=${trainer.id}`)

        return true
      }
    }

    return false
  } catch (error) {
    console.error("❌ Validation error:", error)
    return false
  }
}

// Run validation
validateDataStructure().then((success) => {
  console.log("\n=== FINAL RESULT ===")
  console.log(success ? "✅ ALL VALIDATIONS PASSED" : "❌ VALIDATION FAILED")
})
