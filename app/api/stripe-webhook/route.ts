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
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log("Payment succeeded:", paymentIntent.id)
    console.log("Metadata:", paymentIntent.metadata)

    const tempId = paymentIntent.metadata.tempId
    if (tempId) {
      try {
        console.log("Activating trainer:", tempId)
        await activateTrainer(tempId)
        console.log("Trainer activated successfully:", tempId)
      } catch (error) {
        console.error("Failed to activate trainer:", error)
        // Don't return error - payment was successful
      }
    }
  }

  return NextResponse.json({ received: true })
}
