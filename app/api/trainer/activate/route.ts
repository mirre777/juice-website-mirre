import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Initialize Firebase Admin once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}
const db = getFirestore()

async function updateTrainerInPlace(
  trainerId: string,
  extra: Partial<{
    paymentIntentId: string
    checkoutSessionId: string
    subscriptionId: string
    invoiceId: string
  }>,
) {
  const ref = db.collection("trainers").doc(trainerId)
  const snap = await ref.get()
  if (!snap.exists) {
    return { ok: false as const, status: 404, message: "Trainer not found" }
  }

  const data = snap.data() || {}
  const alreadyActive = data.isPaid === true || data.status === "active" || data.isActive === true

  await ref.set(
    {
      status: "active",
      isActive: true,
      isPaid: true,
      activatedAt: data.activatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(extra.paymentIntentId ? { paymentIntentId: extra.paymentIntentId } : {}),
      ...(extra.checkoutSessionId ? { checkoutSessionId: extra.checkoutSessionId } : {}),
      ...(extra.subscriptionId ? { subscriptionId: extra.subscriptionId } : {}),
      ...(extra.invoiceId ? { invoiceId: extra.invoiceId } : {}),
    },
    { merge: true },
  )

  return { ok: true as const, alreadyActive }
}

async function resolveTrainerIdFromPaymentIntent(paymentIntentId: string) {
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
  let trainerId: string | undefined = (pi.metadata as any)?.trainerId || (pi.metadata as any)?.tempId || undefined

  if (!trainerId) {
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 })
    const session = sessions.data[0]
    if (session?.client_reference_id) {
      trainerId = session.client_reference_id
    }
  }

  return { trainerId, pi }
}

async function resolveTrainerIdFromSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const trainerId = session.client_reference_id || undefined
  return { trainerId, session }
}

/**
 * POST /api/trainer/activate
 * Body: { paymentIntentId?: string, sessionId?: string }
 * Verifies payment/session with Stripe and flips status/isActive/isPaid on trainers/<trainerId> idempotently.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, sessionId } = await request.json().catch(() => ({}))

    if (!paymentIntentId && !sessionId) {
      return NextResponse.json({ error: "paymentIntentId or sessionId is required" }, { status: 400 })
    }

    if (paymentIntentId) {
      const { trainerId, pi } = await resolveTrainerIdFromPaymentIntent(paymentIntentId)
      if (!pi) {
        return NextResponse.json({ error: "PaymentIntent not found" }, { status: 404 })
      }
      if (pi.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not completed", status: pi.status }, { status: 400 })
      }
      if (!trainerId) {
        return NextResponse.json({ error: "Unable to resolve trainerId from payment" }, { status: 400 })
      }
      const result = await updateTrainerInPlace(trainerId, { paymentIntentId })
      return NextResponse.json({ success: true, trainerId, alreadyActive: result.alreadyActive === true })
    }

    if (sessionId) {
      const { trainerId, session } = await resolveTrainerIdFromSession(sessionId)
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }
      if (!trainerId) {
        return NextResponse.json({ error: "Unable to resolve trainerId from session" }, { status: 400 })
      }
      const paid = session.payment_status === "paid" || !!session.subscription
      if (!paid) {
        return NextResponse.json({ error: "Session not paid", status: session.payment_status }, { status: 400 })
      }

      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id
      const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice?.id

      const result = await updateTrainerInPlace(trainerId, {
        checkoutSessionId: sessionId,
        subscriptionId: subscriptionId,
        invoiceId: invoiceId,
      })
      return NextResponse.json({ success: true, trainerId, alreadyActive: result.alreadyActive === true })
    }

    return NextResponse.json({ error: "Unsupported activation payload" }, { status: 400 })
  } catch (error: any) {
    console.error("Activation error:", error?.message || error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
