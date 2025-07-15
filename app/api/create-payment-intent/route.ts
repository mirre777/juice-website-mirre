import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  try {
    const body = await request.json()
    const { amount, currency = "eur", metadata = {}, tempId } = body

    logger.info("Payment intent creation request", {
      requestId,
      amount,
      currency,
      tempId,
      metadata,
    })

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create enhanced metadata including tempId for trainer activation
    const enhancedMetadata = {
      ...metadata,
      tempId: tempId || metadata.tempId, // Include tempId for trainer activation
      plan: metadata.plan || "trainer_activation",
      planType: metadata.planType || "Trainer Website Activation",
      timestamp: new Date().toISOString(),
      requestId,
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: enhancedMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    logger.info("Payment intent created successfully", {
      requestId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      tempId,
      processingTime: Date.now() - startTime,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    logger.error("Payment intent creation failed", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      processingTime: Date.now() - startTime,
    })

    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
