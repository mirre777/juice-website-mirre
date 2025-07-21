const { initializeApp, cert, getApps } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
    console.log("✅ Firebase Admin initialized successfully")
  } catch (error) {
    console.error("❌ Firebase initialization error:", error)
    process.exit(1)
  }
}

const db = getFirestore()

async function testDatabaseUpdate() {
  console.log("=== TESTING DATABASE UPDATE ===")

  const trainerId = "POj2MRZ5ZRbq3CW1U0zJ" // Your test trainer ID

  try {
    // 1. Check if document exists
    console.log("1. Checking if document exists...")
    const docRef = db.collection("trainers").doc(trainerId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.log("❌ Document does not exist. Creating it first...")

      // Create the document with basic structure
      const initialData = {
        fullName: "Mirre Snelting",
        email: "mirresnelting+3@gmail.com",
        phone: "+436602101427",
        location: "Vienna",
        specialty: "Sports Performance",
        experience: "5-10 years",
        certifications: "hhuhgygjhvjgf",
        status: "active",
        isActive: true,
        isPaid: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          hero: {
            title: "Transform Your Body, Transform Your Life",
            subtitle: "Sports Performance • 5-10 years experience • Vienna",
            description: "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
          },
          about: {
            title: "About Mirre Snelting",
            content:
              "write out the complete environment check scripts with the actual contentwrite out the complete environment check scripts with the actual content",
          },
          contact: {
            title: "Let's Start Your Fitness Journey",
            description:
              "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
            email: "mirresnelting@gmail.com",
            phone: "+436602101427",
            location: "Vienna, Austria",
          },
          customization: {
            isDraft: false,
            lastUpdated: new Date().toISOString(),
            version: 1,
          },
        },
      }

      await docRef.set(initialData)
      console.log("✅ Document created successfully")
    }

    // 2. Read current data
    console.log("2. Reading current data...")
    const currentDoc = await docRef.get()
    const currentData = currentDoc.data()

    console.log("Current hero title:", currentData.content?.hero?.title)
    console.log("Current about content:", currentData.content?.about?.content?.substring(0, 100) + "...")

    // 3. Test update
    console.log("\n3. Testing update...")
    const timestamp = new Date().toISOString()
    const testContent = {
      ...currentData.content,
      hero: {
        ...currentData.content?.hero,
        title: `TEST UPDATE - ${timestamp}`,
      },
      about: {
        ...currentData.content?.about,
        content: `TEST CONTENT UPDATE - ${timestamp} - This is a test update to verify database writes are working correctly.`,
      },
    }

    await docRef.update({
      content: testContent,
      updatedAt: timestamp,
    })

    console.log("✅ Update successful!")

    // 4. Verify update
    console.log("\n4. Verifying update...")
    const updatedDoc = await docRef.get()
    const updatedData = updatedDoc.data()

    console.log("New hero title:", updatedData.content?.hero?.title)
    console.log("New about content:", updatedData.content?.about?.content?.substring(0, 100) + "...")
    console.log("Updated at:", updatedData.updatedAt)

    console.log("\n✅ Database update test completed successfully!")
  } catch (error) {
    console.error("❌ Error during database test:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
  }
}

// Run the test
testDatabaseUpdate()
  .then(() => {
    console.log("\n🎉 Test completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error)
    process.exit(1)
  })
