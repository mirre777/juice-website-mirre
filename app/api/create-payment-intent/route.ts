import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tempId, email } = body

    console.log("Creating payment intent with:", { tempId, email })

    if (!tempId) {
      console.error("Missing tempId in request")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Create payment intent with €69 (6900 cents) and enable multiple payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 6900, // €69 in cents
      currency: "eur",
      description: `Trainer Website Activation - ${tempId}`,
      metadata: {
        tempId: tempId,
        plan: "trainer-activation",
        planType: "Trainer Website Activation",
        ...(email && { email }),
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Prevent redirects for better UX
      },
      // Enable multiple payment method types
      payment_method_types: ["card", "paypal", "ideal", "sofort", "bancontact", "giropay", "eps", "p24", "sepa_debit"],
      // Removed setup_future_usage to fix the error
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
