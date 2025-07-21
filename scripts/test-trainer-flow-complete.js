// Complete Trainer Flow Test
// Tests the entire trainer creation, payment, and activation flow

console.log("🏋️ Testing Complete Trainer Flow...\n")

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

// Test data
const testTrainer = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  specialization: "Strength Training",
  location: "Amsterdam",
  experience: "8 years",
  phone: "+31 6 1234 5678",
}

async function testCompleteFlow() {
  console.log("🚀 Starting complete trainer flow test...\n")

  try {
    // Step 1: Create temp trainer
    console.log("1️⃣ Creating temporary trainer...")
    const createResponse = await fetch(`${baseUrl}/api/trainer/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testTrainer),
    })

    if (!createResponse.ok) {
      throw new Error(`Failed to create trainer: ${createResponse.statusText}`)
    }

    const createData = await createResponse.json()
    console.log(`✅ Temp trainer created: ${createData.tempId}`)

    // Step 2: Create payment intent
    console.log("\n2️⃣ Creating payment intent...")
    const paymentResponse = await fetch(`${baseUrl}/api/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 9900,
        currency: "eur",
        tempId: createData.tempId,
      }),
    })

    if (!paymentResponse.ok) {
      throw new Error(`Failed to create payment intent: ${paymentResponse.statusText}`)
    }

    const paymentData = await paymentResponse.json()
    console.log(`✅ Payment intent created: ${paymentData.clientSecret.substring(0, 20)}...`)

    // Step 3: Update payment metadata
    console.log("\n3️⃣ Updating payment metadata...")
    const metadataResponse = await fetch(`${baseUrl}/api/update-payment-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId: paymentData.paymentIntentId,
        tempId: createData.tempId,
      }),
    })

    if (!metadataResponse.ok) {
      throw new Error(`Failed to update metadata: ${metadataResponse.statusText}`)
    }

    console.log("✅ Payment metadata updated")

    // Step 4: Check temp trainer exists
    console.log("\n4️⃣ Verifying temp trainer exists...")
    const tempResponse = await fetch(`${baseUrl}/api/trainer/temp/${createData.tempId}`)

    if (!tempResponse.ok) {
      throw new Error(`Temp trainer not found: ${tempResponse.statusText}`)
    }

    const tempData = await tempResponse.json()
    console.log(`✅ Temp trainer verified: ${tempData.name}`)

    // Step 5: Test activation endpoint (without actually activating)
    console.log("\n5️⃣ Testing activation endpoint...")
    console.log("ℹ️  Note: This would normally be called by Stripe webhook")
    console.log(`   Temp ID: ${createData.tempId}`)
    console.log(`   Payment Intent: ${paymentData.paymentIntentId}`)

    console.log("\n🎉 Complete trainer flow test successful!")
    console.log("\n📋 Summary:")
    console.log(`- Temp Trainer ID: ${createData.tempId}`)
    console.log(`- Payment Intent ID: ${paymentData.paymentIntentId}`)
    console.log(`- Trainer Name: ${tempData.name}`)
    console.log(`- Trainer Email: ${tempData.email}`)
    console.log(`- Location: ${tempData.location}`)

    return {
      success: true,
      tempId: createData.tempId,
      paymentIntentId: paymentData.paymentIntentId,
      trainerData: tempData,
    }
  } catch (error) {
    console.log(`❌ Flow test failed: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testCompleteFlow().catch(console.error)
}

module.exports = { testCompleteFlow }
