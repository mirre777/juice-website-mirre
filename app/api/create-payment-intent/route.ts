import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  console.log("Create payment intent API called")

  try {
    // Check if Stripe secret key is available
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY environment variable is not set")
      return NextResponse.json(
        {
          error: "Server configuration error: Stripe API key is missing",
        },
        { status: 500 },
      )
    }

    // Check if we're using test mode
    const isTestMode = stripeKey.startsWith("sk_test_") || stripeKey.includes("_test_")
    console.log(`Using Stripe in ${isTestMode ? "TEST" : "LIVE"} mode`)

    // Parse the request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { amount, description, metadata } = body

    // Validate required fields
    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    console.log("Creating payment intent with amount:", amount)

    // Initialize Stripe with the secret key
    let stripe
    try {
      stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16",
      })
      console.log("Stripe initialized successfully")
    } catch (stripeInitError) {
      console.error("Error initializing Stripe:", stripeInitError)
      return NextResponse.json(
        {
          error: "Failed to initialize Stripe client",
          details: stripeInitError instanceof Error ? stripeInitError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Convert amount to cents (Stripe expects amounts in cents)
    const amountInCents = Math.round(Number.parseFloat(amount) * 100)

    if (isNaN(amountInCents)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 })
    }

    console.log("Amount in cents:", amountInCents)

    // Create a payment intent
    let paymentIntent
    try {
      console.log("Creating payment intent with metadata:", metadata || {})

      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "eur",
        description: description || "Payment for Juice Fitness",
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      })
      console.log("Payment intent created successfully:", paymentIntent.id)
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError)
      return NextResponse.json(
        {
          error: "Stripe API error",
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
          type: stripeError instanceof Error ? stripeError.constructor.name : "Unknown",
        },
        { status: 500 },
      )
    }

    // Return the client secret - this is necessary for the frontend to complete the payment
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    // Log the detailed error
    console.error("Unhandled error in create-payment-intent:", error)

    // Return a user-friendly error message
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
