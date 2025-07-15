import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, email } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    console.log("Updating payment metadata:", { paymentIntentId, email })

    // Update the payment intent metadata
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        email: email || "",
        updated_at: new Date().toISOString(),
      },
    })

    console.log("Payment metadata updated successfully")

    return NextResponse.json({
      success: true,
      message: "Payment metadata updated",
      paymentIntentId: updatedPaymentIntent.id,
    })
  } catch (error: any) {
    console.error("Error updating payment metadata:", error)
    return NextResponse.json({ error: error.message || "Failed to update payment metadata" }, { status: 500 })
  }
}
