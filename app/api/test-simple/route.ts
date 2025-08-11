import { NextResponse } from "next/server"

export async function GET() {
  console.log("GET request received at test-simple")
  return NextResponse.json({
    status: "success",
    method: "GET",
    message: "Test endpoint working",
  })
}

export async function POST(request: Request) {
  console.log("POST request received at test-simple")

  try {
    const body = await request.text()
    console.log("POST body:", body.substring(0, 200))

    return NextResponse.json({
      status: "success",
      method: "POST",
      message: "Test endpoint working",
      bodyLength: body.length,
    })
  } catch (error) {
    console.error("Error processing POST:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
