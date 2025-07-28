import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { credential } from "firebase-admin"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
      console.error("Missing Firebase Admin credentials")
    } else {
      initializeApp({
        credential: credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      })
      console.log("Firebase Admin initialized successfully")
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching users from admin API...")

    // Check if Firebase Admin is properly configured
    if (!getApps().length) {
      console.log("Firebase Admin not configured, returning mock data")
      return NextResponse.json({
        users: [
          {
            id: "mock-1",
            email: "mock@example.com",
            phone: "+1234567890",
            city: "Mock City",
            user_type: "client",
            status: "waitlist",
            created_at: new Date().toISOString(),
            numClients: null,
          },
        ],
      })
    }

    const db = getFirestore()

    // Fetch all potential users
    const usersSnapshot = await db.collection("potential_users").get()

    console.log(`Found ${usersSnapshot.size} users in database`)

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("User data from Firestore:", data)

      return {
        id: doc.id,
        email: data.email || "N/A",
        phone: data.phone || "N/A",
        city: data.city || "N/A",
        user_type: data.user_type || "unknown",
        status: data.status || "unknown",
        created_at: data.createdAt?.toDate?.()?.toISOString() || data.signUpDate || new Date().toISOString(),
        numClients: data.numClients || null,
        plan: data.plan || "unknown",
        source: data.source || "unknown",
      }
    })

    console.log("Processed users:", users)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
