import { type NextRequest, NextResponse } from "next/server"
import { joinWaitlist } from "@/actions/waitlist-actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    console.log("Test endpoint received form data:", Object.fromEntries(formData.entries()))

    const result = await joinWaitlist(formData)
    console.log("Waitlist action result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
