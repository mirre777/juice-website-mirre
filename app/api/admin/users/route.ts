import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function GET(request: NextRequest) {
  console.log("🔥 ADMIN USERS API CALLED - Starting request processing")
  console.log("📊 Request URL:", request.url)
  console.log("🕐 Timestamp:", new Date().toISOString())

  try {
    console.log("🔍 Checking Firebase configuration...")
    console.log("✅ Has real Firebase config:", hasRealFirebaseConfig)
    console.log("✅ Database instance exists:", !!db)

    // If no real Firebase config, return enhanced mock data with Munich fields
    if (!hasRealFirebaseConfig || !db) {
      console.log("🎭 Using ENHANCED mock data with Munich fields")

      const mockUsers = [
        {
          id: "mock-munich-1",
          email: "test.munich@example.com",
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
          id: "mock-trainer-1",
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
        message: "Enhanced mock data with Munich fields (Firebase not configured)",
        debug: {
          timestamp: new Date().toISOString(),
          munichUsers: mockUsers.filter((u) => u.city === "München").length,
          usersWithPhone: mockUsers.filter((u) => u.phone).length,
          usersWithGoals: mockUsers.filter((u) => u.goal).length,
          sources: [...new Set(mockUsers.map((u) => u.source))],
          cities: [...new Set(mockUsers.map((u) => u.city).filter(Boolean))],
        },
      }

      console.log("📤 Sending enhanced mock response:", JSON.stringify(response, null, 2))
      return NextResponse.json(response)
    }

    // Try to fetch from Firebase with extensive logging
    try {
      console.log("🔥 Attempting to fetch from Firebase...")
      console.log("📊 Database reference:", db)

      const usersRef = collection(db, "potential_users")
      console.log("📁 Collection reference created:", usersRef)

      const q = query(usersRef, orderBy("createdAt", "desc"))
      console.log("🔍 Query created with orderBy createdAt desc")

      console.log("⏳ Executing Firebase query...")
      const querySnapshot = await getDocs(q)
      console.log("✅ Firebase query completed")
      console.log("📊 Documents found:", querySnapshot.size)

      const users = querySnapshot.docs.map((doc, index) => {
        const data = doc.data()
        console.log(`📄 Document ${index + 1} (${doc.id}):`, {
          email: data.email,
          name: data.name || "N/A",
          phone: data.phone || "N/A",
          city: data.city || "N/A",
          district: data.district || "N/A",
          goal: data.goal || "N/A",
          startTime: data.startTime || "N/A",
          source: data.source || "N/A",
          user_type: data.user_type || "N/A",
        })

        return {
          id: doc.id,
          ...data,
        }
      })

      console.log(`✅ Processed ${users.length} users from Firebase`)

      // Analyze the data
      const munichUsers = users.filter((u) => u.city === "München")
      const usersWithPhone = users.filter((u) => u.phone)
      const usersWithGoals = users.filter((u) => u.goal)
      const sources = [...new Set(users.map((u) => u.source).filter(Boolean))]
      const cities = [...new Set(users.map((u) => u.city).filter(Boolean))]

      console.log("📊 Data analysis:")
      console.log("  🏙️ Munich users:", munichUsers.length)
      console.log("  📞 Users with phone:", usersWithPhone.length)
      console.log("  🎯 Users with goals:", usersWithGoals.length)
      console.log("  🌐 Sources found:", sources)
      console.log("  🏘️ Cities found:", cities)

      const response = {
        success: true,
        users,
        count: users.length,
        debug: {
          timestamp: new Date().toISOString(),
          munichUsers: munichUsers.length,
          usersWithPhone: usersWithPhone.length,
          usersWithGoals: usersWithGoals.length,
          sources,
          cities,
          firebaseDocuments: querySnapshot.size,
        },
      }

      console.log("📤 Sending Firebase response with debug info")
      return NextResponse.json(response)
    } catch (firebaseError) {
      console.error("❌ Firebase error occurred:", firebaseError)
      console.error("🔍 Error details:", {
        name: firebaseError instanceof Error ? firebaseError.name : "Unknown",
        message: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
        stack: firebaseError instanceof Error ? firebaseError.stack : "No stack trace",
      })

      // Return error with extensive details
      return NextResponse.json(
        {
          success: false,
          error: `Firebase error: ${firebaseError instanceof Error ? firebaseError.message : String(firebaseError)}`,
          users: [],
          count: 0,
          debug: {
            timestamp: new Date().toISOString(),
            errorType: "firebase_error",
            hasDb: !!db,
            hasConfig: hasRealFirebaseConfig,
          },
        },
        { status: 500 },
      )
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
        },
      },
      { status: 500 },
    )
  }
}
