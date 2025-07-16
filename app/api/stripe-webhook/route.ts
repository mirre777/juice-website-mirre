import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { activateTrainer, getTrainerById } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    console.log("[WEBHOOK] === STRIPE WEBHOOK DEBUG ===")
    console.log("[WEBHOOK] 1. Received webhook")

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
      console.log("[WEBHOOK] 2. Event verified:", event.type)
    } catch (err) {
      console.error("[WEBHOOK] 3. Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[WEBHOOK] 4. Payment succeeded:", paymentIntent.id)

        // Get trainer ID from metadata
        const trainerId = paymentIntent.metadata?.trainerId
        if (trainerId) {
          console.log("[WEBHOOK] 5. Activating trainer:", trainerId)

          try {
            // Check if trainer exists
            const trainer = await getTrainerById(trainerId)
            if (trainer) {
              // Activate the trainer
              await activateTrainer(trainerId)
              console.log("[WEBHOOK] 6. Trainer activated successfully:", trainerId)
            } else {
              console.error("[WEBHOOK] 7. Trainer not found:", trainerId)
            }
          } catch (error) {
            console.error("[WEBHOOK] 8. Error activating trainer:", error)
          }
        } else {
          console.log("[WEBHOOK] 9. No trainer ID in payment metadata")
        }
        break

      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[WEBHOOK] 10. Checkout session completed:", session.id)

        // Get trainer ID from metadata
        const sessionTrainerId = session.metadata?.trainerId
        if (sessionTrainerId) {
          console.log("[WEBHOOK] 11. Activating trainer from session:", sessionTrainerId)

          try {
            // Check if trainer exists
            const trainer = await getTrainerById(sessionTrainerId)
            if (trainer) {
              // Activate the trainer
              await activateTrainer(sessionTrainerId)
              console.log("[WEBHOOK] 12. Trainer activated successfully from session:", sessionTrainerId)
            } else {
              console.error("[WEBHOOK] 13. Trainer not found from session:", sessionTrainerId)
            }
          } catch (error) {
            console.error("[WEBHOOK] 14. Error activating trainer from session:", error)
          }
        } else {
          console.log("[WEBHOOK] 15. No trainer ID in session metadata")
        }
        break

      default:
        console.log("[WEBHOOK] 16. Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[WEBHOOK] 17. Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
