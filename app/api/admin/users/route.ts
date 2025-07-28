import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching users from admin API...")

    // Check if Firebase is properly configured
    if (!hasRealFirebaseConfig || !db) {
      console.log("Firebase not configured, returning mock data")
      return NextResponse.json({
        users: [
          {
            id: "mock-1",
            email: "test@example.com",
            phone: "+1234567890",
            city: "Test City",
            user_type: "client",
            status: "waitlist",
            created_at: new Date().toISOString(),
            plan: "basic",
            numClients: null,
          },
        ],
        message: "Using mock data - Firebase not configured",
      })
    }

    // Check if db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    // Fetch users from Firestore
    const usersRef = collection(db, "potential_users")
    const q = query(usersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("User data from Firestore:", data) // Debug log

      return {
        id: doc.id,
        email: data.email || "N/A",
        phone: data.phone || "N/A",
        city: data.city || "N/A",
        user_type: data.user_type || "client",
        numClients: data.numClients || null,
        status: data.status || "waitlist",
        created_at: data.createdAt || data.created_at || null,
        plan: data.plan || "N/A",
        message: data.message || "",
        origin: data.origin || "",
        source: data.source || "",
      }
    })

    console.log(`Successfully fetched ${users.length} users`)
    console.log("Sample user:", users[0]) // Debug log

    return NextResponse.json({
      users,
      count: users.length,
      message: "Users fetched successfully",
    })
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
