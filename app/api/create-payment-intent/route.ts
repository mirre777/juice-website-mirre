import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

if (isBuildTime) {
  console.log("Build time detected - skipping Stripe initialization in payment route")
}

const stripe = !isBuildTime
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
  : null

/**
 * Creates a Payment Intent for Dumbbell Program Purchase.
 * Expects JSON body with:
 * - email (optional)
 */
export async function POST(request: NextRequest) {
  if (isBuildTime || !stripe) {
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { email } = body as { email?: string }

    const paymentId = `dumbbell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Creating payment intent for dumbbell program with:", { paymentId, email })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200, // €2 in cents
      currency: "eur",
      description: `Dumbbell Workout Program Purchase - ${paymentId}`,
      metadata: {
        paymentId,
        ...(email ? { email } : {}),
        plan: "dumbbell-program",
        planType: "Dumbbell Workout Program",
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    })

    console.log("Payment intent created successfully:", paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment intent" }, { status: 500 })
  }
}
