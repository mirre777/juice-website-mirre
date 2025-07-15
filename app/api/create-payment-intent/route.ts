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
      console.log("Request body parsed successfully:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { tempId, email } = body

    // Validate required fields
    if (!tempId) {
      console.error("Missing tempId in request")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Fixed amount for trainer activation: €69
    const amount = 6900 // €69 in cents
    const description = "Trainer Website Activation - €69"

    console.log("Creating payment intent with:", { amount, tempId, email })

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

    // Create a payment intent with metadata for trainer activation
    let paymentIntent
    try {
      console.log("Creating payment intent with metadata:", {
        tempId,
        email: email || "",
        type: "trainer_activation",
        amount: amount,
      })

      paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // €69 in cents
        currency: "eur",
        description: description,
        metadata: {
          tempId: tempId,
          email: email || "",
          type: "trainer_activation",
          plan: "trainer_website",
          planType: "Trainer Website Activation",
        },
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
