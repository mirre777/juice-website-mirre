import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

/**
 * Creates a Payment Intent for Trainer Activation.
 * Expects JSON body with:
 * - trainerId (preferred) OR tempId (backward compatibility)
 * - email (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trainerId: rawTrainerId, tempId: rawTempId, email } = body as {
      trainerId?: string
      tempId?: string
      email?: string
    }

    // Prefer trainerId; if only tempId is provided, use that as trainerId for now.
    const trainerId = rawTrainerId || rawTempId
    if (!trainerId) {
      console.error("Missing trainerId in request body")
      return NextResponse.json({ error: "trainerId is required" }, { status: 400 })
    }

    console.log("Creating payment intent with:", { trainerId, email })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 6900, // €69 in cents
      currency: "eur",
      description: `Trainer Website Activation - ${trainerId}`,
      metadata: {
        trainerId,
        // Keep tempId too for full backward compatibility during transition
        ...(rawTempId ? { tempId: rawTempId } : {}),
        ...(email ? { email } : {}),
        plan: "trainer-activation",
        planType: "Trainer Website Activation",
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
