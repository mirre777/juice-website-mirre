import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 10)

  console.log("=== MINIMAL WEBHOOK TEST ===", {
    debugId,
    timestamp: new Date().toISOString(),
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    stripeKeyTail: process.env.STRIPE_SECRET_KEY?.slice(-6),
    webhookSecretTail: process.env.STRIPE_WEBHOOK_SECRET?.slice(-6),
  })

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    console.error("[minimal] No signature header", { debugId })
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  console.log("[minimal] Signature header received", {
    debugId,
    signatureLength: signature.length,
    signatureStart: signature.substring(0, 50),
    hasTimestamp: signature.includes("t="),
    hasV1: signature.includes("v1="),
  })

  // Get raw body exactly as Stripe recommends
  const rawBodyBuffer = await request.arrayBuffer()
  const rawBody = Buffer.from(rawBodyBuffer).toString("utf8")

  console.log("[minimal] Raw body details", {
    debugId,
    bufferByteLength: rawBodyBuffer.byteLength,
    stringLength: rawBody.length,
    startsWithBrace: rawBody.startsWith("{"),
    endsWithBrace: rawBody.endsWith("}"),
    firstChars: rawBody.substring(0, 50),
    lastChars: rawBody.substring(rawBody.length - 50),
  })

  // Try signature verification with single secret
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("[minimal] No webhook secret in environment", { debugId })
    return NextResponse.json({ error: "No webhook secret configured" }, { status: 500 })
  }

  console.log("[minimal] Attempting signature verification", {
    debugId,
    secretTail: webhookSecret.slice(-6),
    secretLength: webhookSecret.length,
    secretStartsWithWhsec: webhookSecret.startsWith("whsec_"),
  })

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    console.log("[minimal] SUCCESS! Signature verified", {
      debugId,
      eventId: event.id,
      eventType: event.type,
      livemode: (event as any).livemode,
    })

    return NextResponse.json({
      success: true,
      debugId,
      eventType: event.type,
      eventId: event.id,
    })
  } catch (error: any) {
    console.error("[minimal] Signature verification FAILED", {
      debugId,
      errorMessage: error.message,
      errorType: error.type,
      errorName: error.name,
      stripeErrorType: error.type,
    })

    return NextResponse.json(
      {
        error: "Signature verification failed",
        debugId,
        details: error.message,
      },
      { status: 400 },
    )
  }
}
