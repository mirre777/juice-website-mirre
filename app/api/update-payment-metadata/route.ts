import { type NextRequest, NextResponse } from "next/server"

async function getStripe() {
  // Detect build time and prevent initialization
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.VERCEL_ENV === undefined ||
      process.env.CI === "true" ||
      process.env.NEXT_PHASE === "phase-production-build")
  ) {
    throw new Error("Build time detected - skipping Stripe initialization")
  }

  const { default: Stripe } = await import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })
}

export async function POST(request: NextRequest) {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      (process.env.VERCEL_ENV === undefined ||
        process.env.CI === "true" ||
        process.env.NEXT_PHASE === "phase-production-build")
    ) {
      return NextResponse.json({ error: "Build time detected" }, { status: 503 })
    }

    const { paymentIntentId, email } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    console.log("Updating payment metadata:", { paymentIntentId, email })

    const stripe = await getStripe()

    // Update payment intent metadata
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        email: email || "",
        updated_at: new Date().toISOString(),
      },
    })

    console.log("Payment metadata updated successfully")

    return NextResponse.json({
      success: true,
      paymentIntentId: updatedPaymentIntent.id,
    })
  } catch (error: any) {
    console.error("Error updating payment metadata:", error)
    return NextResponse.json({ error: error.message || "Failed to update payment metadata" }, { status: 500 })
  }
}
