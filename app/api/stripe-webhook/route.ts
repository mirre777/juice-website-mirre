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

// Helper: Idempotent update of trainers/<trainerId>
async function activateTrainerDocInPlace(trainerId: string, paymentIntentId: string) {
  const ref = db.collection("trainers").doc(trainerId)
  const snap = await ref.get()
  if (!snap.exists) {
    console.warn("Webhook: trainer doc not found for trainerId:", trainerId)
    return { updated: false, reason: "not-found" as const }
  }

  const data = snap.data() || {}
  // Idempotency: if already active/paid, no-op
  if (data.isPaid === true || data.status === "active" || data.isActive === true) {
    // Still update paymentIntentId if missing for completeness
    await ref.set(
      {
        paymentIntentId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    console.log("Webhook: trainer already active/paid, no-op update:", trainerId)
    return { updated: false, reason: "already-active" as const }
  }

  await ref.set(
    {
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,
      activatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )
  console.log("Webhook: trainer activated:", trainerId)
  return { updated: true as const }
}

// Helper: Try to resolve trainerId for a PaymentIntent (metadata or via Checkout Session)
async function resolveTrainerIdFromPaymentIntent(paymentIntentId: string, pi?: Stripe.PaymentIntent) {
  let trainerId: string | undefined

  const paymentIntent =
    pi ??
    (await stripe.paymentIntents.retrieve(paymentIntentId).catch((e) => {
      console.error("Webhook: failed to retrieve PaymentIntent:", e?.message)
      return undefined
    }))

  if (paymentIntent?.metadata) {
    trainerId = (paymentIntent.metadata as any).trainerId || (paymentIntent.metadata as any).tempId
  }

  if (!trainerId) {
    // Try to locate a Checkout Session by payment_intent
    const sessions = await stripe.checkout.sessions
      .list({ payment_intent: paymentIntentId, limit: 1 })
      .catch((e) => {
        console.error("Webhook: failed to list checkout sessions:", e?.message)
        return { data: [] }
      })
    const session = sessions?.data?.[0]
    if (session?.client_reference_id) {
      trainerId = session.client_reference_id
    }
  }

  return trainerId
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.error("Webhook: No Stripe signature found")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const paymentIntentId = paymentIntent.id

        const trainerId =
          (paymentIntent.metadata as any)?.trainerId ||
          (paymentIntent.metadata as any)?.tempId ||
          (await resolveTrainerIdFromPaymentIntent(paymentIntentId, paymentIntent))

        if (!trainerId) {
          console.warn("Webhook: Missing trainerId for payment_intent.succeeded", { paymentIntentId })
          return NextResponse.json({ received: true, handled: false })
        }

        await activateTrainerDocInPlace(trainerId, paymentIntentId)
        break
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id

        const trainerId =
          session.client_reference_id ||
          (paymentIntentId ? await resolveTrainerIdFromPaymentIntent(paymentIntentId) : undefined)

        if (!trainerId || !paymentIntentId) {
          console.warn("Webhook: checkout.session.completed missing trainerId/paymentIntentId", {
            trainerId,
            paymentIntentId,
          })
          return NextResponse.json({ received: true, handled: false })
        }

        await activateTrainerDocInPlace(trainerId, paymentIntentId)
        break
      }

      default:
        // Ignore other events
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handling error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
