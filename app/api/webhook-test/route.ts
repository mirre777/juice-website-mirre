import { NextResponse } from "next/server"

export async function GET() {
  console.log("GET request received at webhook-test")
  return NextResponse.json({
    status: "success",
    method: "GET",
    message: "Webhook test endpoint working",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  console.log("POST request received at webhook-test")

  try {
    const body = await request.text()
    console.log("Webhook test - POST body received, length:", body.length)

    return NextResponse.json({
      status: "success",
      method: "POST",
      message: "Webhook test endpoint working",
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
    })
  } catch (error) {
    console.error("Webhook test POST error:", error)
    return NextResponse.json({ error: "POST failed" }, { status: 500 })
  }
}
