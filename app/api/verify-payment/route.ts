import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

/**
 * POST /api/verify-payment
 * Body: { paymentIntentId?: string, sessionId?: string }
 * Purely read-only; returns Stripe status and trainerId if resolvable.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, sessionId } = await request.json().catch(() => ({}))

    if (!paymentIntentId && !sessionId) {
      return NextResponse.json({ success: false, message: "paymentIntentId or sessionId required" }, { status: 400 })
    }

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
      let trainerId = (pi.metadata as any)?.trainerId || (pi.metadata as any)?.tempId || undefined

      if (!trainerId) {
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 })
        const session = sessions.data[0]
        if (session?.client_reference_id) {
          trainerId = session.client_reference_id
        }
      }

      return NextResponse.json({
        success: pi.status === "succeeded",
        status: pi.status,
        trainerId,
        type: "payment_intent",
      })
    }

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const trainerId = session.client_reference_id || undefined
      return NextResponse.json({
        success: session.payment_status === "paid" || !!session.subscription,
        status: session.payment_status,
        trainerId,
        type: "checkout_session",
      })
    }

    return NextResponse.json({ success: false, message: "Unsupported payload" }, { status: 400 })
  } catch (error: any) {
    console.error("verify-payment error:", error?.message || error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
