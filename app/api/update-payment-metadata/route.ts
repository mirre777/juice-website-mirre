import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  console.log("Update payment metadata API called")

  try {
    const { paymentIntentId, email } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    console.log("Updating payment metadata:", { paymentIntentId, email })

    // Update the payment intent metadata
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        email: email || "",
      },
    })

    console.log("Payment metadata updated successfully")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating payment metadata:", error)
    return NextResponse.json({ error: error.message || "Failed to update metadata" }, { status: 500 })
  }
}
