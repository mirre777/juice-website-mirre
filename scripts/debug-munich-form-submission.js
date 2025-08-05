// Debug script for Munich form submission
console.log("🧪 Testing Munich Form Submission...")

// Test data that matches what we see in the console
const testFormData = new FormData()
testFormData.append("email", "mirresnelting@gmail.com")
testFormData.append("city", "München")
testFormData.append("phone", "+436602101427")
testFormData.append("plan", "personal-training-munich")
testFormData.append("user_type", "client")
testFormData.append("numClients", "")
testFormData.append("name", "Mirre Snelting")
testFormData.append("goal", "abnehmen")
testFormData.append("district", "Moosach")
testFormData.append("startTime", "1-2-wochen")
testFormData.append("message", "")

console.log("📝 Test form data prepared:")
for (const [key, value] of testFormData.entries()) {
  console.log(`  ${key}: ${value}`)
}

// Test the server action directly
async function testServerAction() {
  try {
    console.log("🚀 Calling server action...")

    // Import the server action
    const { joinWaitlist } = await import("../actions/waitlist-actions.js")

    // Set a timeout for the operation
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out after 10 seconds")), 10000),
    )

    const actionPromise = joinWaitlist(testFormData)

    const result = await Promise.race([actionPromise, timeoutPromise])

    console.log("✅ Server action result:", result)

    if (result.success) {
      console.log("🎉 Form submission successful!")
    } else {
      console.log("❌ Form submission failed:", result.message)
      if (result.error) {
        console.log("🔍 Error details:", result.error)
      }
    }
  } catch (error) {
    console.error("💥 Server action error:", error)

    if (error.message.includes("timeout")) {
      console.log("⏰ The operation timed out - this suggests a Firebase connection issue")
    }

    if (error.message.includes("permission")) {
      console.log("🔒 Firebase permission error - check your security rules")
    }

    if (error.message.includes("network")) {
      console.log("🌐 Network error - check your internet connection")
    }
  }
}

// Test Firebase connection directly
async function testFirebaseConnection() {
  try {
    console.log("🔥 Testing Firebase connection...")

    const { db, hasRealFirebaseConfig } = await import("../app/api/firebase-config.js")

    console.log("📊 Firebase config status:")
    console.log(`  Has real config: ${hasRealFirebaseConfig}`)
    console.log(`  Database initialized: ${!!db}`)

    if (db) {
      // Try to get a reference to the collection
      const { collection } = await import("firebase/firestore")
      const potentialUsersRef = collection(db, "potential_users")
      console.log("✅ Collection reference created successfully")

      // Try a simple write operation with timeout
      const { addDoc, serverTimestamp } = await import("firebase/firestore")

      const testDoc = {
        test: true,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      }

      console.log("📝 Attempting test write to Firebase...")

      const writePromise = addDoc(potentialUsersRef, testDoc)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase write timed out")), 5000),
      )

      const docRef = await Promise.race([writePromise, timeoutPromise])
      console.log("✅ Test document written with ID:", docRef.id)
    } else {
      console.log("❌ Database not initialized")
    }
  } catch (error) {
    console.error("💥 Firebase connection error:", error)

    if (error.message.includes("timeout")) {
      console.log("⏰ Firebase write operation timed out")
      console.log("💡 This could be due to:")
      console.log("   - Network connectivity issues")
      console.log("   - Firebase security rules blocking writes")
      console.log("   - Firebase project configuration issues")
    }
  }
}

// Run the tests
async function runAllTests() {
  console.log("🎯 Starting Munich form submission debug tests...\n")

  await testFirebaseConnection()
  console.log("\n" + "=".repeat(50) + "\n")
  await testServerAction()

  console.log("\n🏁 Debug tests completed!")
}

runAllTests()
