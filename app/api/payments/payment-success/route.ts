import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isBuildTime } from "@/lib/firebase-global-guard"

export const dynamic = "force-dynamic"

async function getStripe() {
  if (isBuildTime()) {
    console.log("Build time detected - skipping Stripe initialization in payment-success route")
    throw new Error("Stripe not available during build time")
  }

  const { default: Stripe } = await import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
  })
}

/**
 * GET /api/payments/payment-success?payment_intent=pi_123&user_id=456
 * Handle payment success and redirect
 */
export async function GET(request: NextRequest) {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping payment-success route")
    return new Response("Build time - route disabled", { status: 503 })
  }

  try {
    const paymentIntentId = request.nextUrl.searchParams.get("payment_intent")
    const userId = request.nextUrl.searchParams.get("user_id")

    if (!paymentIntentId) {
      // Redirect to error page if no payment intent
      return NextResponse.redirect(new URL("/payment-error", request.url))
    }

    const stripe = await getStripe()

    // Verify the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      // Redirect to error page if payment failed
      return NextResponse.redirect(new URL(`/payment-error?status=${paymentIntent.status}`, request.url))
    }

    // If we have a user ID, create a subscription
    if (userId) {
      // TODO: Store subscription in Firebase
      console.log(`Creating subscription for user ${userId} with payment ${paymentIntentId}`)

      // For now, we'll just redirect to app.juice.fitness
      const redirectUrl = new URL("https://app.juice.fitness/payment-success")
      redirectUrl.searchParams.set("payment_intent", paymentIntentId)
      if (userId) redirectUrl.searchParams.set("user_id", userId)

      return NextResponse.redirect(redirectUrl)
    }

    // If no user ID, just redirect to success page
    return NextResponse.redirect(new URL("/payment/success", request.url))
  } catch (error: any) {
    console.error("Error handling payment success:", error)
    return NextResponse.redirect(new URL(`/payment-error?message=${encodeURIComponent(error.message)}`, request.url))
  }
}
