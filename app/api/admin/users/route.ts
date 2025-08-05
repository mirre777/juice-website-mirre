import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

export async function GET(request: NextRequest) {
  console.log("🔥 ADMIN USERS API CALLED - Starting request processing")
  console.log("📊 Request URL:", request.url)
  console.log("🕐 Timestamp:", new Date().toISOString())

  try {
    console.log("🔍 Checking Firebase configuration...")
    console.log("✅ Has real Firebase config:", hasRealFirebaseConfig)
    console.log("✅ Database instance exists:", !!db)

    if (!hasRealFirebaseConfig || !db) {
      console.log("⚠️ Firebase not configured, returning mock data")
      return getMockDataResponse()
    }

    console.log("🔥 Firebase is configured - attempting to fetch real data")

    // Try to fetch real data from Firebase
    try {
      console.log("📡 Querying 'potential_users' collection...")
      const usersRef = collection(db, "potential_users")
      const usersQuery = query(usersRef, orderBy("createdAt", "desc"), limit(100))

      console.log("⏳ Executing Firestore query...")
      const querySnapshot = await getDocs(usersQuery)

      console.log("✅ Firestore query successful!")
      console.log("📊 Documents found:", querySnapshot.size)

      if (querySnapshot.empty) {
        console.log("📭 No documents found in potential_users collection")
        console.log("🎭 Returning mock data since collection is empty")
        return getMockDataResponse()
      }

      // Process real Firebase data
      const users: any[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log("📄 Processing document:", doc.id)
        console.log("📋 Document data keys:", Object.keys(data))

        users.push({
          id: doc.id,
          ...data,
          // Ensure we have all expected fields with fallbacks
          email: data.email || "N/A",
          name: data.name || data.fullName || "N/A",
          phone: data.phone || data.phoneNumber || null,
          city: data.city || data.location || null,
          district: data.district || data.area || null,
          goal: data.goal || data.fitnessGoal || null,
          startTime: data.startTime || data.preferredStartTime || null,
          message: data.message || data.additionalInfo || null,
          user_type: data.user_type || data.userType || "client",
          plan: data.plan || null,
          numClients: data.numClients || null,
          source: data.source || "unknown",
          status: data.status || "waitlist",
          createdAt: data.createdAt || data.timestamp || { seconds: Date.now() / 1000 },
          signUpDate: data.signUpDate || data.createdAt || new Date().toISOString(),
        })
      })

      console.log("✅ Processed", users.length, "real users from Firebase")

      // Log sample of real data for debugging
      if (users.length > 0) {
        console.log("📋 Sample user data:")
        const sampleUser = users[0]
        console.log("  📧 Email:", sampleUser.email)
        console.log("  👤 Name:", sampleUser.name)
        console.log("  📞 Phone:", sampleUser.phone || "N/A")
        console.log("  🏙️ City:", sampleUser.city || "N/A")
        console.log("  🎯 Goal:", sampleUser.goal || "N/A")
        console.log("  📍 Source:", sampleUser.source)
      }

      const response = {
        success: true,
        users: users,
        count: users.length,
        message: `Successfully fetched ${users.length} real users from Firebase`,
        debug: {
          timestamp: new Date().toISOString(),
          dataSource: "firebase",
          munichUsers: users.filter((u) => u.city === "München").length,
          usersWithPhone: users.filter((u) => u.phone).length,
          usersWithGoals: users.filter((u) => u.goal).length,
          sources: [...new Set(users.map((u) => u.source))],
          cities: [...new Set(users.map((u) => u.city).filter(Boolean))],
          firebaseConfigured: hasRealFirebaseConfig,
        },
      }

      console.log("📤 Sending real Firebase data response")
      console.log("📊 Response summary:", {
        success: response.success,
        userCount: response.users.length,
        munichUsers: response.debug.munichUsers,
        cities: response.debug.cities,
        sources: response.debug.sources,
      })

      return NextResponse.json(response)
    } catch (firestoreError) {
      console.error("❌ Firestore query failed:", firestoreError)
      console.error("🔍 Firestore error details:", {
        name: firestoreError instanceof Error ? firestoreError.name : "Unknown",
        message: firestoreError instanceof Error ? firestoreError.message : String(firestoreError),
        code: (firestoreError as any)?.code || "unknown",
      })

      // If Firestore fails, return mock data with error info
      console.log("🎭 Falling back to mock data due to Firestore error")
      return getMockDataResponse(firestoreError instanceof Error ? firestoreError.message : "Firestore query failed")
    }
  } catch (error) {
    console.error("❌ General API error:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "No stack trace",
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        users: [],
        count: 0,
        debug: {
          timestamp: new Date().toISOString(),
          errorType: "general_error",
          dataSource: "error",
        },
      },
      { status: 500 },
    )
  }
}

function getMockDataResponse(errorMessage?: string) {
  console.log("🎭 Generating mock data response")
  if (errorMessage) {
    console.log("⚠️ Mock data reason:", errorMessage)
  }

  const mockUsers = [
    {
      id: "mock-munich-1",
      email: "max.mustermann@example.com",
      name: "Max Mustermann",
      phone: "+49 89 123456789",
      city: "München",
      district: "Maxvorstadt",
      goal: "muskelaufbau",
      startTime: "sofort",
      message: "Ich möchte gerne mit Personal Training beginnen",
      user_type: "client",
      plan: "personal-training-munich",
      source: "munich-landing-page",
      status: "waitlist",
      createdAt: { seconds: Date.now() / 1000 },
      signUpDate: new Date().toISOString(),
    },
    {
      id: "mock-munich-2",
      email: "anna.mueller@example.com",
      name: "Anna Müller",
      phone: "+49 89 987654321",
      city: "München",
      district: "Schwabing",
      goal: "abnehmen",
      startTime: "1-2-wochen",
      message: "Suche professionelle Unterstützung beim Abnehmen",
      user_type: "client",
      plan: "personal-training-munich",
      source: "munich-landing-page",
      status: "waitlist",
      createdAt: { seconds: (Date.now() - 3600000) / 1000 },
      signUpDate: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "mock-berlin-1",
      email: "trainer.berlin@example.com",
      name: "Personal Trainer Berlin",
      phone: "+49 30 555666777",
      city: "Berlin",
      user_type: "trainer",
      plan: "pro",
      numClients: 15,
      source: "trainer-signup",
      status: "waitlist",
      createdAt: { seconds: (Date.now() - 86400000) / 1000 },
      signUpDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock-basic-1",
      email: "basic.user@example.com",
      name: "Basic User",
      user_type: "client",
      source: "website_waitlist",
      status: "waitlist",
      createdAt: { seconds: (Date.now() - 172800000) / 1000 },
      signUpDate: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "mock-munich-3",
      email: "lisa.wagner@example.com",
      name: "Lisa Wagner",
      phone: "+49 89 444555666",
      city: "München",
      district: "Bogenhausen",
      goal: "gesundheit",
      startTime: "1-monat",
      message: "Möchte nach Verletzung wieder fit werden",
      user_type: "client",
      plan: "personal-training-munich",
      source: "munich-landing-page",
      status: "contacted",
      createdAt: { seconds: (Date.now() - 259200000) / 1000 },
      signUpDate: new Date(Date.now() - 259200000).toISOString(),
    },
  ]

  return NextResponse.json({
    success: true,
    users: mockUsers,
    count: mockUsers.length,
    message: errorMessage
      ? `Mock data returned due to error: ${errorMessage}`
      : "Mock data for testing (Firebase not configured or no real data)",
    debug: {
      timestamp: new Date().toISOString(),
      dataSource: "mock",
      reason: errorMessage || "firebase_not_configured",
      munichUsers: mockUsers.filter((u) => u.city === "München").length,
      usersWithPhone: mockUsers.filter((u) => u.phone).length,
      usersWithGoals: mockUsers.filter((u) => u.goal).length,
      sources: [...new Set(mockUsers.map((u) => u.source))],
      cities: [...new Set(mockUsers.map((u) => u.city).filter(Boolean))],
      firebaseConfigured: hasRealFirebaseConfig,
    },
  })
}
