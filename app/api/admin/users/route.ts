import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest) {
  try {
    // If we don't have real Firebase config, return mock data
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock data for admin users API")
      return NextResponse.json({
        users: [
          {
            id: "mock-1",
            name: "Max Mustermann",
            email: "max@example.com",
            user_type: "client",
            city: "München",
            district: "Schwabing-West",
            goal: "muskelaufbau",
            startTime: "sofort",
            phone: "+49 89 123456",
            status: "waitlist",
            source: "munich-landing-page",
            createdAt: new Date(),
          },
          {
            id: "mock-2",
            name: "Anna Schmidt",
            email: "anna@example.com",
            user_type: "trainer",
            city: "München",
            numClients: 15,
            phone: "+49 89 987654",
            status: "active",
            source: "trainer-signup",
            createdAt: new Date(),
          },
        ],
      })
    }

    // Check if Firebase db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    // Fetch users from Firebase
    const usersRef = collection(db, "potential_users")
    const q = query(usersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`Fetched ${users.length} users from Firebase`)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
