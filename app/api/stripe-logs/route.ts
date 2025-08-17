import { NextResponse } from "next/server"

// This is a simple in-memory store for logs
// In production, you would use a database
const logs: any[] = []
const MAX_LOGS = 100

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Don't log sensitive information
    const sanitizedBody = { ...body }

    // Remove sensitive fields
    if (sanitizedBody.clientSecret) {
      sanitizedBody.clientSecret = "[REDACTED]"
    }

    // Add timestamp
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...sanitizedBody,
    }

    // Add to logs
    logs.unshift(logEntry)

    // Keep only the last MAX_LOGS entries
    if (logs.length > MAX_LOGS) {
      logs.length = MAX_LOGS
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging Stripe event:", error)
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Check if authenticated (you should implement proper auth)
  const url = new URL(request.url)
  const debugToken = url.searchParams.get("debug_token")

  if (debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ logs })
}
