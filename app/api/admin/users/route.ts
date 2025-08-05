import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"

export async function GET(request: NextRequest) {
  console.log("🔥 ADMIN USERS API CALLED - Starting request processing")
  console.log("📊 Request URL:", request.url)
  console.log("🕐 Timestamp:", new Date().toISOString())

  try {
    console.log("🔍 Checking Firebase configuration...")
    console.log("✅ Has real Firebase config:", hasRealFirebaseConfig)
    console.log("✅ Database instance exists:", !!db)

    // Always return enhanced mock data for now to test the UI
    console.log("🎭 Returning ENHANCED mock data with Munich fields for testing")

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

    console.log("📋 Mock users created:", mockUsers.length)
    console.log("🎯 Munich users:", mockUsers.filter((u) => u.city === "München").length)
    console.log("👥 Users with phone:", mockUsers.filter((u) => u.phone).length)
    console.log("🏃 Users with goals:", mockUsers.filter((u) => u.goal).length)
    console.log("⏰ Users with start times:", mockUsers.filter((u) => u.startTime).length)

    // Log each user's fields for debugging
    mockUsers.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`, {
        id: user.id,
        email: user.email,
        name: user.name || "N/A",
        phone: user.phone || "N/A",
        city: user.city || "N/A",
        district: user.district || "N/A",
        goal: user.goal || "N/A",
        startTime: user.startTime || "N/A",
        source: user.source,
        user_type: user.user_type,
      })
    })

    const response = {
      success: true,
      users: mockUsers,
      count: mockUsers.length,
      message: "Enhanced mock data with Munich fields for testing",
      debug: {
        timestamp: new Date().toISOString(),
        munichUsers: mockUsers.filter((u) => u.city === "München").length,
        usersWithPhone: mockUsers.filter((u) => u.phone).length,
        usersWithGoals: mockUsers.filter((u) => u.goal).length,
        sources: [...new Set(mockUsers.map((u) => u.source))],
        cities: [...new Set(mockUsers.map((u) => u.city).filter(Boolean))],
        firebaseConfigured: hasRealFirebaseConfig,
      },
    }

    console.log("📤 Sending enhanced mock response")
    console.log("📊 Response summary:", {
      success: response.success,
      userCount: response.users.length,
      munichUsers: response.debug.munichUsers,
      cities: response.debug.cities,
    })

    return NextResponse.json(response)
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
        },
      },
      { status: 500 },
    )
  }
}
