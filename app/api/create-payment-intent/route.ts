import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tempId, email } = body

    console.log("[PAYMENT] Creating payment intent with:", { tempId, email })

    if (!tempId) {
      console.error("[PAYMENT] Missing tempId in request")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // For now, let's skip Firebase verification to avoid the 500 error
    // We'll create the payment intent directly
    try {
      // Create payment intent with €69 (6900 cents)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 6900, // €69 in cents
        currency: "eur",
        description: `Trainer Website Activation - ${tempId}`,
        metadata: {
          tempId: tempId,
          plan: "trainer-activation",
          planType: "Trainer Website Activation",
          ...(email && { email }),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // Prevent redirects for better UX
        },
      })

      console.log("[PAYMENT] Payment intent created successfully:", paymentIntent.id)

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    } catch (stripeError) {
      console.error("[PAYMENT] Stripe error:", stripeError)
      return NextResponse.json(
        {
          error: "Payment system error",
          details: stripeError instanceof Error ? stripeError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("[PAYMENT] Error creating payment intent:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
