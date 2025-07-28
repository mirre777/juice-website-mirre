import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

const db = getFirestore()

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  user_type?: string
  numClients?: number
  status: string
  created_at?: any
  createdAt?: any
}

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching users from Firebase...")

    // Check if Firebase is properly initialized
    if (!db) {
      console.error("Firebase not initialized")
      return NextResponse.json(
        {
          error: "Database not initialized",
          users: [],
        },
        { status: 500 },
      )
    }

    // Fetch users from potential_users collection
    const usersSnapshot = await db.collection("potential_users").get()

    if (usersSnapshot.empty) {
      console.log("No users found in database")
      return NextResponse.json({ users: [] })
    }

    const users: PotentialUser[] = []

    usersSnapshot.forEach((doc) => {
      const data = doc.data()
      console.log("Processing user document:", doc.id, data)

      users.push({
        id: doc.id,
        email: data.email || "N/A",
        phone: data.phone || "N/A",
        city: data.city || "N/A",
        user_type: data.user_type || data.role || "unknown",
        numClients: data.numClients || 0,
        status: data.status || "waitlist",
        created_at: data.createdAt || data.created_at || new Date(),
      })
    })

    console.log(`Found ${users.length} users`)
    console.log("Sample user data:", users[0])

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)

    // Return mock data for development
    const mockUsers: PotentialUser[] = [
      {
        id: "mock-1",
        email: "test@example.com",
        phone: "+1234567890",
        city: "Test City",
        user_type: "client",
        numClients: 0,
        status: "waitlist",
        created_at: new Date(),
      },
    ]

    return NextResponse.json({
      users: mockUsers,
      error: "Using mock data - Firebase error: " + (error instanceof Error ? error.message : String(error)),
    })
  }
}
