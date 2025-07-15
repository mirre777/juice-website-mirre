import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "eur", tempId, email } = await req.json()

    logger.info("Creating payment intent", { amount, currency, tempId, email })

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!tempId) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency,
      metadata: {
        tempId,
        email: email || "",
        type: "trainer_activation",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    logger.info("Payment intent created successfully", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      tempId,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    logger.error("Payment intent creation failed", {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
