import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function getStripe() {
  const { default: Stripe } = await import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })
}

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 8)

  console.log(`[minimal-webhook-${debugId}] === MINIMAL WEBHOOK TEST ===`)

  // Log basic request info
  const host = request.headers.get("host")
  const signature = request.headers.get("stripe-signature")
  const contentType = request.headers.get("content-type")

  console.log(`[minimal-webhook-${debugId}] Request info:`, {
    host,
    hasSignature: !!signature,
    signatureLength: signature?.length,
    contentType,
    url: request.url,
  })

  if (!signature) {
    console.log(`[minimal-webhook-${debugId}] ERROR: No signature header`)
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  // Get raw body
  const rawBody = await request.text()
  console.log(`[minimal-webhook-${debugId}] Body info:`, {
    length: rawBody.length,
    firstChars: rawBody.substring(0, 50),
    lastChars: rawBody.substring(rawBody.length - 50),
  })

  // Try signature verification with primary secret only
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.log(`[minimal-webhook-${debugId}] ERROR: No webhook secret`)
    return NextResponse.json({ error: "No webhook secret configured" }, { status: 500 })
  }

  console.log(`[minimal-webhook-${debugId}] Secret info:`, {
    hasSecret: !!webhookSecret,
    secretLength: webhookSecret.length,
    secretStart: webhookSecret.substring(0, 10),
    secretEnd: webhookSecret.substring(webhookSecret.length - 6),
  })

  try {
    console.log(`[minimal-webhook-${debugId}] Attempting signature verification...`)

    const stripe = await getStripe()
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    console.log(`[minimal-webhook-${debugId}] SUCCESS! Event verified:`, {
      id: event.id,
      type: event.type,
      created: event.created,
    })

    return NextResponse.json({
      success: true,
      eventId: event.id,
      eventType: event.type,
      debugId,
    })
  } catch (error: any) {
    console.log(`[minimal-webhook-${debugId}] SIGNATURE VERIFICATION FAILED:`, {
      errorType: error.type,
      errorMessage: error.message,
      errorName: error.name,
    })

    return NextResponse.json(
      {
        error: "Signature verification failed",
        details: error.message,
        debugId,
      },
      { status: 400 },
    )
  }
}
