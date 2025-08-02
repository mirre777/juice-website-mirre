import { NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function GET() {
  try {
    console.log("Admin users API called")

    // If we don't have real Firebase config, return mock data
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock Firebase configuration - returning sample data")

      const mockUsers = [
        {
          id: "mock-1",
          name: "Max Mustermann",
          email: "max@example.com",
          phone: "+49 123 456789",
          city: "München",
          district: "Schwabing-West",
          goal: "muskelaufbau",
          startTime: "sofort",
          user_type: "client",
          status: "waitlist",
          source: "munich-landing-page",
          createdAt: new Date().toISOString(),
          message: "Ich möchte endlich richtig mit dem Training anfangen!",
        },
        {
          id: "mock-2",
          name: "Anna Schmidt",
          email: "anna@example.com",
          phone: "+49 987 654321",
          city: "München",
          district: "Maxvorstadt",
          goal: "abnehmen",
          startTime: "1-2-wochen",
          user_type: "client",
          status: "waitlist",
          source: "munich-landing-page",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          message: "Suche einen Coach für Gewichtsreduktion",
        },
        {
          id: "mock-3",
          name: "Personal Trainer Pro",
          email: "trainer@example.com",
          phone: "+49 555 123456",
          city: "München",
          user_type: "trainer",
          status: "pending",
          source: "trainer-signup",
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          numClients: 15,
          plan: "pro",
          message: "Erfahrener Trainer mit 10 Jahren Erfahrung",
        },
      ]

      return NextResponse.json({
        success: true,
        users: mockUsers,
        message: "Mock data returned (Preview Mode)",
      })
    }

    // Check if Firebase db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized:", db)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection error",
          users: [],
        },
        { status: 500 },
      )
    }

    console.log("Fetching users from Firebase...")

    // Fetch users from Firebase
    const usersRef = collection(db, "potential_users")
    const q = query(usersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to serializable format
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    })

    console.log(`Successfully fetched ${users.length} users from Firebase`)

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
