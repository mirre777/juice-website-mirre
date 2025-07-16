import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { activateTrainer } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    console.log("[WEBHOOK] Event received:", event.type)
  } catch (err: any) {
    console.error("[WEBHOOK] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[WEBHOOK] Payment succeeded:", paymentIntent.id)

      try {
        const tempId = paymentIntent.metadata.tempId
        if (!tempId) {
          console.error("[WEBHOOK] No tempId in payment metadata")
          break
        }

        console.log("[WEBHOOK] Activating trainer:", tempId)

        // Activate the trainer
        const result = await activateTrainer(tempId, {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          email: paymentIntent.metadata.email,
          paidAt: new Date().toISOString(),
        })

        console.log("[WEBHOOK] Trainer activated successfully:", result.finalId)
      } catch (error) {
        console.error("[WEBHOOK] Error activating trainer:", error)
        // Don't return error to Stripe - we don't want them to retry
      }
      break

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log("[WEBHOOK] Payment failed:", failedPayment.id)
      break

    default:
      console.log("[WEBHOOK] Unhandled event type:", event.type)
  }

  return NextResponse.json({ received: true })
}
