import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  console.log("🔍 Munich form debug API called")

  const debugInfo = {
    timestamp: new Date().toISOString(),
    hasRealFirebaseConfig,
    dbInitialized: !!db,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  }

  console.log("🔧 Debug info:", debugInfo)

  try {
    // Test 1: Check if we can parse form data
    console.log("📝 Test 1: Parsing form data...")
    const formData = await request.formData()
    const formEntries = Object.fromEntries(formData.entries())
    console.log("✅ Form data parsed:", formEntries)

    // Test 2: Check Firebase config
    console.log("🔥 Test 2: Firebase configuration...")
    if (!hasRealFirebaseConfig) {
      console.log("⚠️ No real Firebase config - using mock mode")
      return NextResponse.json({
        success: true,
        message: "Mock mode - form would succeed",
        debugInfo,
        formData: formEntries,
        mockMode: true,
      })
    }

    // Test 3: Check database connection
    console.log("💾 Test 3: Database connection...")
    if (!db) {
      throw new Error("Database not initialized")
    }

    // Test 4: Try to write to database
    console.log("✍️ Test 4: Writing to database...")
    const testData = {
      email: formEntries.email || "test@example.com",
      name: formEntries.name || "Test User",
      city: "München",
      source: "debug-test",
      createdAt: serverTimestamp(),
      debugTest: true,
    }

    const docRef = await addDoc(collection(db, "potential_users"), testData)
    console.log("✅ Document written with ID:", docRef.id)

    return NextResponse.json({
      success: true,
      message: "All tests passed",
      debugInfo,
      formData: formEntries,
      documentId: docRef.id,
      testData,
    })
  } catch (error) {
    console.error("❌ Debug test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        debugInfo,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Munich form debug API",
    endpoints: {
      POST: "Test form submission flow",
      GET: "This info message",
    },
    timestamp: new Date().toISOString(),
  })
}
