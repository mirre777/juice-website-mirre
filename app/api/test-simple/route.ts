import { NextResponse } from "next/server"

export async function GET() {
  console.log("GET request received at test-simple")
  return NextResponse.json({
    message: "Simple test endpoint working",
    method: "GET",
    timestamp: new Date().toISOString(),
    env_check: process.env.STRIPE_WEBHOOK_SECRET ? "webhook_secret_exists" : "no_webhook_secret",
  })
}

export async function POST(request: Request) {
  console.log("POST request received at test-simple")

  try {
    const body = await request.text()
    console.log("POST body length:", body.length)

    return NextResponse.json({
      message: "Simple test endpoint working",
      method: "POST",
      timestamp: new Date().toISOString(),
      env_check: process.env.STRIPE_WEBHOOK_SECRET ? "webhook_secret_exists" : "no_webhook_secret",
      body_received: body.length > 0,
    })
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json({ error: "Failed to process POST" }, { status: 500 })
  }
}
