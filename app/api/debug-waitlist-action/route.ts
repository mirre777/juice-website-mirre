import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  console.log("🔍 Debug Waitlist Action API called")

  try {
    const body = await request.json()
    console.log("📝 Request body:", body)

    // Test Firebase connection first
    console.log("🔥 Testing Firebase connection...")

    const testDoc = {
      test: true,
      timestamp: serverTimestamp(),
      message: "Debug test document",
    }

    console.log("📝 Adding test document to Firestore...")
    const docRef = await addDoc(collection(db, "debug-test"), testDoc)
    console.log("✅ Test document added with ID:", docRef.id)

    // Now test actual waitlist addition
    console.log("📝 Testing waitlist document addition...")

    const waitlistData = {
      email: body.email || "debug@test.com",
      name: body.name || "Debug User",
      city: body.city || "München",
      goal: body.goal || "muskelaufbau",
      district: body.district || "Maxvorstadt",
      startTime: body.startTime || "sofort",
      user_type: body.user_type || "client",
      plan: body.plan || "personal-training-munich",
      phone: body.phone || "+49 89 12345678",
      message: body.message || "Debug test",
      timestamp: serverTimestamp(),
      source: "debug-api",
    }

    const waitlistRef = await addDoc(collection(db, "waitlist"), waitlistData)
    console.log("✅ Waitlist document added with ID:", waitlistRef.id)

    return NextResponse.json({
      success: true,
      testDocId: docRef.id,
      waitlistDocId: waitlistRef.id,
      message: "Both Firebase operations completed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Debug Waitlist Action error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Debug Waitlist Action API",
    description: "Tests Firebase operations directly",
    timestamp: new Date().toISOString(),
  })
}
