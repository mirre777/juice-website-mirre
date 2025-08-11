import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Simple test endpoint working",
    method: "GET",
    timestamp: new Date().toISOString(),
    env_check: process.env.STRIPE_WEBHOOK_SECRET ? "webhook_secret_exists" : "no_webhook_secret",
  })
}

export async function POST() {
  return NextResponse.json({
    message: "Simple test endpoint working",
    method: "POST",
    timestamp: new Date().toISOString(),
    env_check: process.env.STRIPE_WEBHOOK_SECRET ? "webhook_secret_exists" : "no_webhook_secret",
  })
}
