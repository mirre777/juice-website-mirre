import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the Stripe secret key is set
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY

    // Get the first and last 4 characters of the key for debugging (if it exists)
    const keyPreview = hasStripeKey
      ? `${process.env.STRIPE_SECRET_KEY?.substring(0, 4)}...${process.env.STRIPE_SECRET_KEY?.slice(-4)}`
      : "not set"

    // Check if the publishable key is set
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    // Return the status of the Stripe configuration
    return NextResponse.json({
      stripeSecretKeySet: hasStripeKey,
      keyPreview,
      publishableKeySet: hasPublishableKey,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in debug-stripe route:", error)
    return NextResponse.json({ error: "Failed to check Stripe configuration" }, { status: 500 })
  }
}
