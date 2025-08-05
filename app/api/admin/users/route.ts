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
      console.error("❌ Firebase not properly configured")
      return NextResponse.json(
        {
          success: false,
          error: "Firebase not configured",
          users: [],
          count: 0,
          debug: {
            timestamp: new Date().toISOString(),
            hasRealFirebaseConfig,
            hasDb: !!db,
          },
        },
        { status: 500 },
      )
    }

    console.log("🔥 Firebase is configured - attempting to fetch real data")

    // Query the potential_users collection
    console.log("📡 Querying 'potential_users' collection...")
    const usersRef = collection(db, "potential_users")
    const usersQuery = query(usersRef, orderBy("createdAt", "desc"), limit(100))

    console.log("⏳ Executing Firestore query...")
    const querySnapshot = await getDocs(usersQuery)

    console.log("✅ Firestore query completed successfully!")
    console.log("📊 Documents found:", querySnapshot.size)

    if (querySnapshot.empty) {
      console.log("📭 No documents found in potential_users collection")
      return NextResponse.json({
        success: true,
        users: [],
        count: 0,
        message: "No users found in database",
        debug: {
          timestamp: new Date().toISOString(),
          dataSource: "firebase",
          collectionEmpty: true,
          firebaseConfigured: hasRealFirebaseConfig,
        },
      })
    }

    // Process real Firebase data
    const users: any[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log("📄 Processing document:", doc.id)
      console.log("📋 Document data keys:", Object.keys(data))
      console.log("📋 Document data sample:", {
        email: data.email,
        name: data.name || data.fullName,
        city: data.city,
        source: data.source,
      })

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

    // Log detailed analysis
    const munichUsers = users.filter((u) => u.city === "München")
    const usersWithPhone = users.filter((u) => u.phone)
    const usersWithGoals = users.filter((u) => u.goal)
    const sources = [...new Set(users.map((u) => u.source))]
    const cities = [...new Set(users.map((u) => u.city).filter(Boolean))]

    console.log("📊 Data analysis:")
    console.log("  🏙️ Munich users:", munichUsers.length)
    console.log("  📞 Users with phone:", usersWithPhone.length)
    console.log("  🎯 Users with goals:", usersWithGoals.length)
    console.log("  📍 Sources:", sources)
    console.log("  🌍 Cities:", cities)

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
      console.log("  📅 Created:", sampleUser.createdAt)
    }

    const response = {
      success: true,
      users: users,
      count: users.length,
      message: `Successfully fetched ${users.length} real users from Firebase`,
      debug: {
        timestamp: new Date().toISOString(),
        dataSource: "firebase",
        munichUsers: munichUsers.length,
        usersWithPhone: usersWithPhone.length,
        usersWithGoals: usersWithGoals.length,
        sources: sources,
        cities: cities,
        firebaseConfigured: hasRealFirebaseConfig,
        collectionEmpty: false,
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
  } catch (error) {
    console.error("❌ API Error:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code || "unknown",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })

    // Check for specific Firebase errors
    if ((error as any)?.code) {
      console.error("🔥 Firebase error code:", (error as any).code)

      if ((error as any).code === "permission-denied") {
        console.error("🚫 Permission denied - check Firestore security rules")
      } else if ((error as any).code === "unavailable") {
        console.error("📡 Firebase unavailable - network or service issue")
      } else if ((error as any).code === "unauthenticated") {
        console.error("🔐 Unauthenticated - check Firebase auth")
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        errorCode: (error as any)?.code || "unknown",
        users: [],
        count: 0,
        debug: {
          timestamp: new Date().toISOString(),
          errorType: "firebase_query_error",
          dataSource: "error",
          firebaseConfigured: hasRealFirebaseConfig,
          errorDetails: {
            name: error instanceof Error ? error.name : "Unknown",
            message: error instanceof Error ? error.message : String(error),
            code: (error as any)?.code || "unknown",
          },
        },
      },
      { status: 500 },
    )
  }
}
