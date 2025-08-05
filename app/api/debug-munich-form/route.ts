import { type NextRequest, NextResponse } from "next/server"
import { addToWaitlist } from "@/actions/waitlist-actions"

export async function POST(request: NextRequest) {
  console.log("🔍 Debug Munich Form API called")

  try {
    // Test basic functionality
    const testData = {
      email: "debug-test@example.com",
      name: "Debug Test User",
      city: "München",
      goal: "muskelaufbau",
      district: "Maxvorstadt",
      startTime: "sofort",
      user_type: "client",
      plan: "personal-training-munich",
      phone: "+49 89 12345678",
      message: "Debug test submission",
    }

    console.log("🧪 Testing with data:", testData)

    // Create FormData object
    const formData = new FormData()
    Object.entries(testData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    console.log("📝 FormData created, calling addToWaitlist...")

    // Test the actual waitlist action
    const startTime = Date.now()
    const result = await addToWaitlist(null, formData)
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`⏱️ addToWaitlist completed in ${duration}ms`)
    console.log("✅ Result:", result)

    return NextResponse.json({
      success: true,
      result,
      duration,
      testData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Debug Munich Form error:", error)

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
    message: "Munich Form Debug API",
    endpoints: {
      POST: "Test form submission",
      GET: "This info",
    },
    timestamp: new Date().toISOString(),
  })
}
