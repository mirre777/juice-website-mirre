import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore"

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  user_type: string
  status: string
  created_at: string
  numClients?: number
  plan?: string
  source?: string
  // NEW: Munich-specific fields
  name?: string
  goal?: string
  district?: string
  startTime?: string
  origin?: string
}

export async function GET(request: NextRequest) {
  try {
    console.log("Admin users API called")
    console.log("Firebase config available:", hasRealFirebaseConfig)
    console.log("Database instance:", !!db)

    // If we don't have real Firebase config, return mock data
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock Firebase configuration - returning sample data")
      const mockUsers: PotentialUser[] = [
        {
          id: "mock-1",
          email: "john.doe@example.com",
          phone: "+49 123 456789",
          city: "München",
          district: "Schwabing-West",
          user_type: "client",
          status: "waitlist",
          created_at: new Date().toISOString(),
          name: "John Doe",
          goal: "Muskelaufbau",
          startTime: "sofort",
          source: "munich-landing",
          origin: "https://juice-website.vercel.app/personal-training-muenchen",
        },
        {
          id: "mock-2",
          email: "maria.trainer@example.com",
          phone: "+49 987 654321",
          city: "München",
          district: "Maxvorstadt",
          user_type: "trainer",
          status: "waitlist",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          name: "Maria Schmidt",
          numClients: 15,
          plan: "pro",
          source: "trainer-signup",
        },
      ]

      return NextResponse.json({
        success: true,
        users: mockUsers,
        message: "Mock data (Firebase not configured)",
      })
    }

    // Check if Firebase db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized")
      return NextResponse.json(
        {
          success: false,
          error: "Firebase database not properly initialized",
          users: [],
        },
        { status: 500 },
      )
    }

    console.log("Fetching users from Firebase...")

    // Get users from Firebase
    const potentialUsersRef = collection(db, "potential_users")
    const usersQuery = query(potentialUsersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(usersQuery)

    console.log("Query snapshot size:", querySnapshot.size)

    const users: PotentialUser[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log("Processing document:", doc.id, data)

      // Handle Firestore Timestamp
      let createdAt = new Date().toISOString()
      if (data.createdAt) {
        if (data.createdAt instanceof Timestamp) {
          createdAt = data.createdAt.toDate().toISOString()
        } else if (typeof data.createdAt === "string") {
          createdAt = data.createdAt
        } else if (data.signUpDate) {
          createdAt = data.signUpDate
        }
      }

      const user: PotentialUser = {
        id: doc.id,
        email: data.email || "",
        phone: data.phone || "",
        city: data.city || "",
        district: data.district || "", // NEW field
        user_type: data.user_type || "client",
        status: data.status || "waitlist",
        created_at: createdAt,
        numClients: data.numClients || undefined,
        plan: data.plan || "",
        source: data.source || "",
        // NEW: Munich-specific fields
        name: data.name || "",
        goal: data.goal || "",
        startTime: data.startTime || "",
        origin: data.origin || "",
      }

      users.push(user)
    })

    console.log("Processed users:", users.length)

    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        users: [],
      },
      { status: 500 },
    )
  }
}
