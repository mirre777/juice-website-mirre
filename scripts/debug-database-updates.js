// Debug script to test database updates
const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

// Initialize Firebase Admin
if (!require("firebase-admin").apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

async function testDatabaseUpdate() {
  console.log("=== TESTING DATABASE UPDATE ===")

  const trainerId = "POj2MRZ5ZRbq3CW1U0zJ" // Your test trainer ID

  try {
    // 1. Read current data
    console.log("1. Reading current data...")
    const docRef = db.collection("trainers").doc(trainerId)
    const docSnap = await docRef.get()

    if (docSnap.exists()) {
      const currentData = docSnap.data()
      console.log("Current hero title:", currentData.content?.hero?.title)
      console.log("Current about bio:", currentData.content?.about?.bio)

      // 2. Test update
      console.log("\n2. Testing update...")
      const testContent = {
        ...currentData.content,
        hero: {
          ...currentData.content?.hero,
          title: `TEST UPDATE - ${new Date().toISOString()}`,
        },
        about: {
          ...currentData.content?.about,
          bio: `TEST BIO UPDATE - ${new Date().toISOString()}`,
        },
      }

      await docRef.update({
        content: testContent,
        updatedAt: new Date().toISOString(),
      })

      console.log("✅ Update successful!")

      // 3. Verify update
      console.log("\n3. Verifying update...")
      const updatedDoc = await docRef.get()
      const updatedData = updatedDoc.data()

      console.log("New hero title:", updatedData.content?.hero?.title)
      console.log("New about bio:", updatedData.content?.about?.bio)
      console.log("Updated at:", updatedData.updatedAt)
    } else {
      console.log("❌ Document not found")
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run the test
testDatabaseUpdate()
