import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin if not already initialized
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
      console.log("Firebase Admin initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error)
      throw error
    }
  }
  return getFirestore()
}

export async function GET(request: NextRequest) {
  console.log("Admin users API called")

  try {
    const db = initializeFirebaseAdmin()
    console.log("Firebase Admin initialized")

    // Get all potential users from Firestore
    const usersSnapshot = await db.collection("potential_users").get()
    console.log(`Found ${usersSnapshot.size} potential users`)

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("Processing user document:", doc.id, data)

      return {
        id: doc.id,
        email: data.email || "N/A",
        phone: data.phone || "N/A",
        city: data.city || "N/A",
        user_type: data.user_type || "undefined",
        numClients: data.numClients || null,
        status: data.status || "unknown",
        created_at: data.created_at || data.createdAt || null,
        plan: data.plan || "unknown",
      }
    })

    console.log("Processed users:", users)

    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)

    // Return mock data if Firebase fails
    const mockUsers = [
      {
        id: "mock-1",
        email: "test@example.com",
        phone: "+1234567890",
        city: "Test City",
        user_type: "client",
        numClients: null,
        status: "waitlist",
        created_at: new Date().toISOString(),
        plan: "basic",
      },
    ]

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      users: mockUsers,
      count: mockUsers.length,
      mock: true,
    })
  }
}
