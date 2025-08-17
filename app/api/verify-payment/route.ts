import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

async function resolveTrainerIdFromPaymentIntent(paymentIntentId: string) {
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    let trainerId =
      (pi.metadata as any)?.trainerId ||
      (pi.metadata as any)?.tempId ||
      undefined

    if (!trainerId) {
      const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 })
      const session = sessions.data[0]
      if (session?.client_reference_id) {
        trainerId = session.client_reference_id
      }
    }
    return trainerId
  } catch (e) {
    console.error("verify-payment: failed to resolve trainerId:", (e as any)?.message)
    return undefined
  }
}

/**
 * POST /api/verify-payment
 * Body: { paymentIntentId: string }
 * Purely read-only; returns Stripe status and trainerId if resolvable.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()
    if (!paymentIntentId) {
      return NextResponse.json({ success: false, message: "paymentIntentId required" }, { status: 400 })
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    const trainerId = await resolveTrainerIdFromPaymentIntent(paymentIntentId)

    return NextResponse.json({
      success: pi.status === "succeeded",
      status: pi.status,
      trainerId,
    })
  } catch (error: any) {
    console.error("verify-payment error:", error?.message || error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
