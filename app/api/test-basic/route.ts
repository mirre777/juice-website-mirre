import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  })
}
