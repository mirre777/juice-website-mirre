import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin users API called")
    console.log("Has real Firebase config:", hasRealFirebaseConfig)
    console.log("Database instance:", !!db)

    // If no real Firebase config, return mock data
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock data for admin users")

      const mockUsers = [
        {
          id: "mock-1",
          email: "test@example.com",
          name: "Test User",
          phone: "+49 89 123456789",
          city: "München",
          district: "Maxvorstadt",
          goal: "muskelaufbau",
          startTime: "sofort",
          user_type: "client",
          plan: "personal-training-munich",
          source: "munich-landing-page",
          status: "waitlist",
          createdAt: { seconds: Date.now() / 1000 },
          signUpDate: new Date().toISOString(),
        },
        {
          id: "mock-2",
          email: "trainer@example.com",
          name: "Test Trainer",
          phone: "+49 89 987654321",
          city: "München",
          user_type: "trainer",
          plan: "pro",
          numClients: 15,
          source: "trainer-signup",
          status: "waitlist",
          createdAt: { seconds: (Date.now() - 86400000) / 1000 },
          signUpDate: new Date(Date.now() - 86400000).toISOString(),
        },
      ]

      return NextResponse.json({
        success: true,
        users: mockUsers,
        count: mockUsers.length,
        message: "Mock data (Firebase not configured)",
      })
    }

    // Try to fetch from Firebase
    try {
      console.log("Fetching users from Firebase...")

      const usersRef = collection(db, "potential_users")
      const q = query(usersRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log(`Found ${users.length} users in Firebase`)

      return NextResponse.json({
        success: true,
        users,
        count: users.length,
      })
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError)

      // Return error with details
      return NextResponse.json(
        {
          success: false,
          error: `Firebase error: ${firebaseError instanceof Error ? firebaseError.message : String(firebaseError)}`,
          users: [],
          count: 0,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Admin users API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        users: [],
        count: 0,
      },
      { status: 500 },
    )
  }
}
