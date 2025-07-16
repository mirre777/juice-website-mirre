import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getTrainerById } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { trainerId, amount = 2900 } = await request.json() // Default €29.00

    console.log("[PAYMENT] === CREATE PAYMENT INTENT DEBUG ===")
    console.log("[PAYMENT] 1. Creating payment intent for trainer:", trainerId)
    console.log("[PAYMENT] 2. Amount:", amount)

    if (!trainerId) {
      return NextResponse.json({ error: "Missing trainer ID" }, { status: 400 })
    }

    // Verify trainer exists
    const trainer = await getTrainerById(trainerId)
    if (!trainer) {
      console.log("[PAYMENT] 3. Trainer not found:", trainerId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    console.log("[PAYMENT] 4. Trainer found:", trainer.fullName || trainer.name)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "eur",
      metadata: {
        trainerId: trainerId,
        trainerName: trainer.fullName || trainer.name,
        service: "trainer_website_activation",
      },
      description: `Trainer Website Activation - ${trainer.fullName || trainer.name}`,
    })

    console.log("[PAYMENT] 5. Payment intent created:", paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[PAYMENT] 6. Error creating payment intent:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
