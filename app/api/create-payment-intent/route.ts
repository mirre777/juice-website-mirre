import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getTempTrainerById } from "@/lib/firebase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tempId, email } = body

    console.log("[PAYMENT] Creating payment intent with:", { tempId, email })

    if (!tempId) {
      console.error("[PAYMENT] Missing tempId in request")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    try {
      // Verify temp trainer exists in Firebase
      const tempTrainer = await getTempTrainerById(tempId)
      if (!tempTrainer) {
        console.log("[PAYMENT] Temp trainer not found:", tempId)
        return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
      }

      console.log("[PAYMENT] Temp trainer found:", tempTrainer.name)

      // Create payment intent with €69 (6900 cents)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 6900, // €69 in cents
        currency: "eur",
        description: `Trainer Website Activation - ${tempTrainer.name}`,
        metadata: {
          tempId: tempId,
          trainerName: tempTrainer.name,
          plan: "trainer-activation",
          planType: "Trainer Website Activation",
          ...(email && { email }),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // Prevent redirects for better UX
        },
      })

      console.log("[PAYMENT] Payment intent created successfully:", paymentIntent.id)

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    } catch (firebaseError) {
      console.error("[PAYMENT] Firebase error:", firebaseError)
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("[PAYMENT] Error creating payment intent:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment intent" }, { status: 500 })
  }
}
