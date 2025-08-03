import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching users from Firebase...")

    // Try to fetch from Firebase
    const waitlistRef = collection(db, "waitlist")
    const q = query(waitlistRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || null,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        user_type: data.user_type || "client",
        plan: data.plan || null,
        numClients: data.numClients || null,
        goal: data.goal || null,
        district: data.district || null,
        startTime: data.startTime || null,
        message: data.message || null,
        source: data.source || "general",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }
    })

    console.log(`Successfully fetched ${users.length} users from Firebase`)

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users from Firebase:", error)

    // Fallback: Return mock data for development
    const mockUsers = [
      {
        id: "mock_1",
        name: "Max Mustermann",
        email: "max@example.com",
        phone: "+49 89 123456789",
        city: "München",
        user_type: "client" as const,
        plan: "personal-training-munich",
        numClients: null,
        goal: "muskelaufbau",
        district: "Schwabing-West",
        startTime: "1-2-wochen",
        message: "Ich möchte endlich richtig mit dem Training anfangen!",
        source: "munich-landing-page",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock_2",
        name: "Anna Schmidt",
        email: "anna@example.com",
        phone: null,
        city: "München",
        user_type: "client" as const,
        plan: "personal-training-munich",
        numClients: null,
        goal: "abnehmen",
        district: "Maxvorstadt",
        startTime: "sofort",
        message: null,
        source: "munich-landing-page",
        status: "contacted" as const,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "mock_3",
        name: "Thomas Trainer",
        email: "thomas@example.com",
        phone: "+49 89 987654321",
        city: "Berlin",
        user_type: "trainer" as const,
        plan: "coach",
        numClients: 15,
        goal: null,
        district: null,
        startTime: null,
        message: "Ich bin erfahrener Personal Trainer und möchte mehr Kunden gewinnen.",
        source: "general",
        status: "converted" as const,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    console.log("Using mock data:", mockUsers.length, "users")

    return NextResponse.json({
      success: true,
      users: mockUsers,
      count: mockUsers.length,
      note: "Using mock data due to Firebase connection issues",
    })
  }
}
