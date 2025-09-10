import { type NextRequest, NextResponse } from "next/server"

// Completely isolated payment route with zero Firebase dependencies
// This route only uses Stripe and has no shared modules that could import Firebase

export async function POST(request: NextRequest) {
  try {
    // Only use environment variables that are guaranteed to be available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    // Dynamic import of Stripe to avoid any build-time issues
    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })

    const { amount, currency = "usd" } = await request.json()

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
