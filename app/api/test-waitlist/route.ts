import { type NextRequest, NextResponse } from "next/server"
import { joinWaitlist } from "@/actions/waitlist-actions"

export async function POST(request: NextRequest) {
  console.log("🧪 Test waitlist API called")

  try {
    // Get form data from request
    const formData = await request.formData()

    console.log("📝 Received form data:")
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    // Call the waitlist action
    console.log("🔄 Calling joinWaitlist action...")
    const startTime = Date.now()

    const result = await joinWaitlist(formData)

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`⏱️ Action completed in ${duration}ms`)
    console.log("📊 Action result:", result)

    return NextResponse.json({
      success: true,
      result,
      duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Test waitlist API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test waitlist API is working",
    timestamp: new Date().toISOString(),
  })
}
