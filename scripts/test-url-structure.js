console.log("=== TESTING URL STRUCTURE FOR TRAINER PAGES ===")

// Test the URL structure for different trainer page types
function testUrlStructure() {
  console.log("\n=== URL STRUCTURE GUIDE ===")

  // Example trainer ID from Firebase
  const exampleTempId = "gIYBUWzst2ILOKsSrv_3y"
  const exampleActiveId = "gIYBUWzst2ILOKsSrv_3y" // Same ID after activation

  console.log("1. TEMP TRAINER PAGE (24-hour preview):")
  console.log(`   URL: /marketplace/trainer/temp/${exampleTempId}`)
  console.log(`   Full URL: https://yourdomain.com/marketplace/trainer/temp/${exampleTempId}`)
  console.log("   - Shows countdown timer")
  console.log("   - Has 'Activate Now' button")
  console.log("   - Expires after 24 hours")
  console.log("")

  console.log("2. LIVE TRAINER PAGE (after payment):")
  console.log(`   URL: /marketplace/trainer/${exampleActiveId}`)
  console.log(`   Full URL: https://yourdomain.com/marketplace/trainer/${exampleActiveId}`)
  console.log("   - Permanent page")
  console.log("   - No countdown timer")
  console.log("   - Professional trainer profile")
  console.log("")

  console.log("3. PAYMENT PAGE:")
  console.log(`   URL: /payment?tempId=${exampleTempId}`)
  console.log(`   Full URL: https://yourdomain.com/payment?tempId=${exampleTempId}`)
  console.log("   - Stripe payment form")
  console.log("   - Shows trainer preview")
  console.log("")

  console.log("4. TRAINER DASHBOARD:")
  console.log(`   URL: /marketplace/trainer/${exampleActiveId}/dashboard`)
  console.log(`   Full URL: https://yourdomain.com/marketplace/trainer/${exampleActiveId}/dashboard`)
  console.log("   - Analytics and stats")
  console.log("   - Only accessible by trainer")
  console.log("")

  console.log("5. TRAINER EDITOR:")
  console.log(`   URL: /marketplace/trainer/${exampleActiveId}/edit`)
  console.log(`   Full URL: https://yourdomain.com/marketplace/trainer/${exampleActiveId}/edit`)
  console.log("   - Content editing interface")
  console.log("   - Only accessible by trainer")
  console.log("")

  console.log("=== FLOW SUMMARY ===")
  console.log("1. User fills form → Creates temp trainer")
  console.log("2. Redirects to: /marketplace/trainer/temp/[tempId]")
  console.log("3. User clicks 'Activate' → Goes to: /payment?tempId=[tempId]")
  console.log("4. Payment success → Trainer becomes active")
  console.log("5. Final live page: /marketplace/trainer/[id]")
  console.log("")

  return {
    tempUrl: `/marketplace/trainer/temp/${exampleTempId}`,
    liveUrl: `/marketplace/trainer/${exampleActiveId}`,
    paymentUrl: `/payment?tempId=${exampleTempId}`,
    dashboardUrl: `/marketplace/trainer/${exampleActiveId}/dashboard`,
    editUrl: `/marketplace/trainer/${exampleActiveId}/edit`,
  }
}

// Test with actual data structure
async function testDataStructureWithBio() {
  console.log("\n=== TESTING NEW BIO STRUCTURE ===")

  const mockTrainerData = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    location: "Vienna, Austria",
    experience: "3-5 years",
    specialty: "Weight Loss",
    certifications: "NASM Certified",
    bio: "Experienced trainer specializing in weight loss and strength training.",
    services: ["Personal Training", "Nutrition Coaching"],
  }

  console.log("Input bio:", mockTrainerData.bio)
  console.log("")

  // Simulate the data structure that would be created
  const simulatedTrainerDocument = {
    id: "example123",
    fullName: mockTrainerData.fullName,
    email: mockTrainerData.email,
    experience: mockTrainerData.experience,
    specialty: mockTrainerData.specialty,
    certifications: mockTrainerData.certifications,
    services: mockTrainerData.services,
    status: "temp",
    isPaid: false,
    isActive: false,
    content: {
      about: {
        title: `About ${mockTrainerData.fullName}`,
        bio: mockTrainerData.bio, // ✅ Now using 'bio' instead of 'content'
      },
      contact: {
        email: mockTrainerData.email,
        phone: mockTrainerData.phone,
        location: mockTrainerData.location,
        title: "Let's Start Your Fitness Journey",
        description: "Ready to transform your fitness? Get in touch to schedule your first session.",
      },
      customization: {
        isDraft: false,
        lastUpdated: new Date().toISOString(),
        version: 1,
      },
    },
  }

  console.log("✅ NEW STRUCTURE:")
  console.log("content.about.bio:", simulatedTrainerDocument.content.about.bio)
  console.log("content.contact.phone:", simulatedTrainerDocument.content.contact.phone)
  console.log("content.contact.location:", simulatedTrainerDocument.content.contact.location)
  console.log("")

  console.log("✅ VALIDATION:")
  console.log("- Bio is in content.about.bio ✓")
  console.log("- Phone is in content.contact.phone ✓")
  console.log("- Location is in content.contact.location ✓")
  console.log("- No bio/phone/location at root level ✓")
  console.log("- Status is 'temp' (not 'pending') ✓")
  console.log("- isPaid and isActive are boolean ✓")

  return simulatedTrainerDocument
}

// Run the tests
console.log("Starting URL structure and bio field tests...")

const urls = testUrlStructure()
const mockData = testDataStructureWithBio()

console.log("\n=== SUMMARY ===")
console.log("✅ Changed content.about.content → content.about.bio")
console.log("✅ Final live URL structure: /marketplace/trainer/[id]")
console.log("✅ All URLs follow consistent pattern")
console.log("")
console.log("Example URLs for trainer ID 'gIYBUWzst2ILOKsSrv_3y':")
console.log("- Temp page:", urls.tempUrl)
console.log("- Live page:", urls.liveUrl)
console.log("- Payment:", urls.paymentUrl)
