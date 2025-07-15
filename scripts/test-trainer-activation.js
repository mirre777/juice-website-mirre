// Diagnostic script to test trainer activation flow
const testTrainerActivation = async () => {
  console.log("🧪 Testing Trainer Activation Flow")
  console.log("=".repeat(50))

  // Test data
  const testTempId = "IhTGfW9c5CNDTzhjUhgS" // From your Firebase
  const testPaymentIntentId = "pi_3R16vsGgz8IrkBaO0l1ZRe9e" // From your logs

  try {
    // Test 1: Check if temp trainer exists
    console.log("📋 Test 1: Checking temp trainer...")
    const tempResponse = await fetch(`/api/trainer/temp/${testTempId}?token=VKdSMbxepnQi6TS6GrMz3oskhmuA01Sx`)
    const tempData = await tempResponse.json()

    console.log("Temp trainer status:", {
      exists: tempResponse.ok,
      status: tempData.trainer?.status,
      isActive: tempData.trainer?.isActive,
      isPaid: tempData.trainer?.isPaid,
    })

    // Test 2: Try manual activation
    console.log("\n🔄 Test 2: Testing activation API...")
    const activationResponse = await fetch("/api/trainer/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: testTempId,
        paymentIntentId: testPaymentIntentId,
      }),
    })

    const activationData = await activationResponse.json()
    console.log("Activation result:", {
      success: activationData.success,
      finalId: activationData.finalId,
      error: activationData.error,
    })

    // Test 3: Check if trainer was activated
    if (activationData.success && activationData.finalId) {
      console.log("\n✅ Test 3: Checking activated trainer...")
      const finalResponse = await fetch(`/api/trainer/content/${activationData.finalId}`)
      const finalData = await finalResponse.json()

      console.log("Final trainer status:", {
        exists: finalResponse.ok,
        status: finalData.trainer?.status,
        isActive: finalData.trainer?.isActive,
        isPaid: finalData.trainer?.isPaid,
        hasContent: !!finalData.trainer?.content,
      })
    }

    // Test 4: Check webhook processing
    console.log("\n🔗 Test 4: Webhook simulation...")
    console.log("Payment Intent ID:", testPaymentIntentId)
    console.log("Expected metadata should include:", {
      tempId: testTempId,
      amount: 2900, // €29.00 in cents
    })
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }

  console.log("\n" + "=".repeat(50))
  console.log("🏁 Test completed")
}

// Run the test
testTrainerActivation()
