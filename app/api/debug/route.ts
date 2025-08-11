import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  console.log("DEBUG: GET request received")
  return NextResponse.json({
    message: "Debug endpoint working",
    method: "GET",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  console.log("DEBUG: POST request received")

  try {
    const body = await request.text()
    console.log("DEBUG: Request body:", body.substring(0, 200))

    return NextResponse.json({
      message: "Debug endpoint working",
      method: "POST",
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
    })
  } catch (error) {
    console.error("DEBUG: Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
