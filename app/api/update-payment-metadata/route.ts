import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  console.log("Update payment metadata API called")

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

    // Parse the request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { paymentIntentId, email } = body

    // Validate required fields
    if (!paymentIntentId || !email) {
      return NextResponse.json({ error: "Payment intent ID and email are required" }, { status: 400 })
    }

    console.log(`Updating payment intent ${paymentIntentId} with email ${email}`)

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

    // Get the current payment intent
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      console.log("Payment intent retrieved successfully")
    } catch (stripeError) {
      console.error("Error retrieving payment intent:", stripeError)
      return NextResponse.json(
        {
          error: "Failed to retrieve payment intent",
          details: stripeError instanceof Error ? stripeError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Update the payment intent metadata
    try {
      const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          ...paymentIntent.metadata,
          userEmail: email,
        },
      })
      console.log("Payment intent metadata updated successfully")

      return NextResponse.json({
        success: true,
        paymentIntentId: updatedPaymentIntent.id,
      })
    } catch (stripeError) {
      console.error("Error updating payment intent:", stripeError)
      return NextResponse.json(
        {
          error: "Failed to update payment intent",
          details: stripeError instanceof Error ? stripeError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    // Log the detailed error
    console.error("Unhandled error in update-payment-metadata:", error)

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
