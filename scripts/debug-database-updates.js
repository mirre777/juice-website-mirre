// Debug script to test database updates
const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

// Initialize Firebase Admin
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("❌ Missing Firebase environment variables")
  process.exit(1)
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})

const db = getFirestore(app)

async function testDatabaseOperations() {
  const trainerId = "POj2MRZ5ZRbq3CW1U0zJ" // Your test trainer ID

  console.log("🔍 Testing Database Operations")
  console.log("================================")

  try {
    // 1. Read current data
    console.log("\n1. Reading current data...")
    const doc = await db.collection("trainers").doc(trainerId).get()

    if (!doc.exists) {
      console.log("❌ Document does not exist")
      return
    }

    const currentData = doc.data()
    console.log("✅ Current data structure:")
    console.log("- Full Name:", currentData.fullName)
    console.log("- Content exists:", !!currentData.content)
    console.log("- About title:", currentData.content?.about?.title)
    console.log("- About bio (first 100 chars):", currentData.content?.about?.bio?.substring(0, 100))
    console.log("- Hero title:", currentData.content?.hero?.title)
    console.log("- Last updated:", currentData.content?.customization?.lastUpdated)

    // 2. Test update
    console.log("\n2. Testing update...")
    const testTimestamp = new Date().toISOString()
    const testContent = {
      ...currentData.content,
      hero: {
        ...currentData.content?.hero,
        title: `TEST UPDATE ${testTimestamp}`,
      },
      about: {
        ...currentData.content?.about,
        bio: `This is a test bio update at ${testTimestamp}. The database update is working correctly!`,
      },
      customization: {
        ...currentData.content?.customization,
        lastUpdated: testTimestamp,
        version: (currentData.content?.customization?.version || 0) + 1,
      },
    }

    await db.collection("trainers").doc(trainerId).update({
      content: testContent,
      updatedAt: testTimestamp,
    })

    console.log("✅ Update completed")

    // 3. Read back to verify
    console.log("\n3. Reading back to verify...")
    const updatedDoc = await db.collection("trainers").doc(trainerId).get()
    const updatedData = updatedDoc.data()

    console.log("✅ Verification results:")
    console.log("- Hero title:", updatedData.content?.hero?.title)
    console.log("- About bio (first 100 chars):", updatedData.content?.about?.bio?.substring(0, 100))
    console.log("- Last updated:", updatedData.content?.customization?.lastUpdated)
    console.log("- Version:", updatedData.content?.customization?.version)
    console.log("- Document updatedAt:", updatedData.updatedAt)

    console.log("\n🎉 Database operations test completed successfully!")
  } catch (error) {
    console.error("❌ Error during database operations:", error)
  }
}

// Run the test
testDatabaseOperations()
  .then(() => {
    console.log("\n✅ Script completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Script failed:", error)
    process.exit(1)
  })
