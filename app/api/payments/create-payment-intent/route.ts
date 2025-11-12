import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

if (isBuildTime) {
  console.log("Build time detected - skipping Stripe initialization in payment route")
}

const stripe = !isBuildTime
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
  : null

/**
 * Creates a Payment Intent for Trainer Activation.
 * Expects JSON body with:
 * - trainerId (preferred) OR tempId (backward compatibility) - OPTIONAL for dumbbell program
 * - email (optional)
 */
export async function POST(request: NextRequest) {
  if (isBuildTime || !stripe) {
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const {
      trainerId: rawTrainerId,
      tempId: rawTempId,
      email,
      productType = "trainer-activation",
    } = body as {
      trainerId?: string
      tempId?: string
      email?: string
      productType?: string
    }

    if (productType === "trainer-activation") {
      // Prefer trainerId; if only tempId is provided, use that as trainerId for now.
      const trainerId = rawTrainerId || rawTempId
      if (!trainerId) {
        console.error("Missing trainerId in request body")
        return NextResponse.json({ error: "trainerId is required" }, { status: 400 })
      }
    }

    const trainerId = rawTrainerId || rawTempId || `dumbbell-${Date.now()}`

    console.log("Creating payment intent with:", { trainerId, email, productType })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: productType === "dumbbell-program" ? 200 : 6900, // €2 for dumbbell, €69 for trainer
      currency: "eur",
      description:
        productType === "dumbbell-program"
          ? `Dumbbell Workout Program - ${trainerId}`
          : `Trainer Website Activation - ${trainerId}`,
      metadata: {
        trainerId,
        // Keep tempId too for full backward compatibility during transition
        ...(rawTempId ? { tempId: rawTempId } : {}),
        ...(email ? { email } : {}),
        plan: productType === "dumbbell-program" ? "dumbbell-program" : "trainer-activation",
        planType: productType === "dumbbell-program" ? "Dumbbell Workout Program" : "Trainer Website Activation",
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
