import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 10)

  console.log("=== WEBHOOK TEST (SIGNATURE BYPASS) ===", {
    debugId,
    timestamp: new Date().toISOString(),
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  })

  const rawBodyBuffer = await request.arrayBuffer()
  const rawBody = Buffer.from(rawBodyBuffer).toString("utf8")

  console.log("[bypass] Raw body received", {
    debugId,
    bodyLength: rawBody.length,
    startsWithBrace: rawBody.startsWith("{"),
  })

  try {
    // Parse the event directly without signature verification
    const event = JSON.parse(rawBody)

    console.log("[bypass] Event parsed successfully", {
      debugId,
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
    })

    if (event.type === "checkout.session.completed") {
      console.log("[bypass] Processing checkout.session.completed", {
        debugId,
        sessionId: event.data.object.id,
        customerId: event.data.object.customer,
      })

      // Your actual webhook logic would go here
      // For now, just log success
      console.log("[bypass] Checkout session processing would happen here")
    }

    return NextResponse.json({
      success: true,
      debugId,
      eventType: event.type,
      eventId: event.id,
      message: "Webhook processed successfully (signature bypassed for testing)",
    })
  } catch (error: any) {
    console.error("[bypass] Error processing webhook", {
      debugId,
      errorMessage: error.message,
    })

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        debugId,
        details: error.message,
      },
      { status: 400 },
    )
  }
}
