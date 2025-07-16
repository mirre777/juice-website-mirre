import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { activateTrainer } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.error("[WEBHOOK] No Stripe signature found")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("[WEBHOOK] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log("[WEBHOOK] Webhook event received:", event.type)

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log("[WEBHOOK] Payment succeeded:", paymentIntent.id)

    try {
      const tempId = paymentIntent.metadata.tempId
      if (!tempId) {
        console.error("[WEBHOOK] No tempId in payment metadata")
        return NextResponse.json({ error: "Missing tempId" }, { status: 400 })
      }

      console.log("[WEBHOOK] Activating trainer:", tempId)

      // Activate trainer using Firebase Admin
      const result = await activateTrainer(tempId, {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
      })

      console.log("[WEBHOOK] Trainer activated successfully:", result.finalId)

      return NextResponse.json({ success: true, finalId: result.finalId })
    } catch (error) {
      console.error("[WEBHOOK] Error activating trainer:", error)
      return NextResponse.json({ error: "Activation failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
