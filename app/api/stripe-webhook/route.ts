import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { activateTrainer } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("[WEBHOOK] Received event:", event.type)

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const tempId = paymentIntent.metadata.tempId

      console.log("[WEBHOOK] Payment succeeded for tempId:", tempId)

      if (tempId) {
        try {
          await activateTrainer(tempId, paymentIntent.id)
          console.log("[WEBHOOK] Trainer activated successfully:", tempId)
        } catch (error) {
          console.error("[WEBHOOK] Failed to activate trainer:", error)
          // Don't return error to Stripe, just log it
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[WEBHOOK] Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
