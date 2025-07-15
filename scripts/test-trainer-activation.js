// Test script for trainer activation flow
console.log("🧪 Testing Trainer Activation Flow")

const testTempId = "IhTGfW9c5CNDTzhjUhgS"
const testEmail = "test@example.com"

async function testActivationFlow() {
  console.log("=".repeat(50))
  console.log("📋 Test 1: Checking temp trainer...")

  try {
    // Test 1: Check if temp trainer exists
    const tempResponse = await fetch(`/api/trainer/temp/${testTempId}?token=VKdSMbxepnQi6TS6GrMz3oskhmuA01Sx`)
    console.log("Temp trainer API response:", tempResponse.status)

    if (tempResponse.ok) {
      const tempData = await tempResponse.json()
      console.log("✅ Temp trainer found:", {
        id: tempData.trainer?.id,
        status: tempData.trainer?.status,
        isActive: tempData.trainer?.isActive,
      })
    } else {
      console.log("❌ Temp trainer not found or error:", tempResponse.status)
      return
    }

    console.log("\n💳 Test 2: Creating payment intent...")

    // Test 2: Create payment intent
    const paymentResponse = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: testTempId,
        email: testEmail,
      }),
    })

    if (paymentResponse.ok) {
      const paymentData = await paymentResponse.json()
      console.log("✅ Payment intent created:", paymentData.paymentIntentId)
    } else {
      const errorData = await paymentResponse.json()
      console.log("❌ Payment intent failed:", errorData.error)
      return
    }

    console.log("\n🔄 Test 3: Testing activation API...")

    // Test 3: Test activation API directly
    const activationResponse = await fetch("/api/trainer/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: testTempId,
        paymentIntentId: "test_payment_intent",
      }),
    })

    if (activationResponse.ok) {
      const activationData = await activationResponse.json()
      console.log("✅ Activation successful:", activationData.message)
    } else {
      const errorData = await activationResponse.json()
      console.log("❌ Activation failed:", errorData.error)
    }

    console.log("\n🌐 Test 4: Checking activated trainer...")

    // Test 4: Check if trainer is now active
    const activeResponse = await fetch(`/api/trainer/content/${testTempId}`)

    if (activeResponse.ok) {
      const activeData = await activeResponse.json()
      console.log("✅ Active trainer found:", {
        id: activeData.trainer?.id,
        status: activeData.trainer?.status,
        isActive: activeData.trainer?.isActive,
        hasContent: !!activeData.trainer?.content,
      })
    } else {
      const errorData = await activeResponse.json()
      console.log("❌ Active trainer check failed:", errorData.error)
    }
  } catch (error) {
    console.log("❌ Test failed:", error.message)
  }

  console.log("=".repeat(50))
  console.log("✅ Test completed")
}

// Run the test
testActivationFlow()
