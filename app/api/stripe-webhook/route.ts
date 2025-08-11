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
    console.warn("Webhook: trainer doc not found for trainerId:", trainerId)
    return { updated: false, reason: "not-found" as const }
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

  return { updated: !alreadyActive, reason: alreadyActive ? "already-active" : "activated" }
}

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
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 }).catch((e) => {
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

        const result = await updateTrainerInPlace(trainerId, { paymentIntentId })
        console.log("Webhook: payment_intent.succeeded handled", { trainerId, result })
        break
      }

      case "checkout.session.completed": {
        // This path covers Stripe Checkout including subscription mode and Payment Links.
        const session = event.data.object as Stripe.Checkout.Session

        const trainerId = session.client_reference_id || undefined
        const checkoutSessionId = session.id
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id
        const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice?.id

        if (!trainerId) {
          console.warn("Webhook: checkout.session.completed missing client_reference_id", { checkoutSessionId })
          return NextResponse.json({ received: true, handled: false })
        }

        // If the session payment_status is "paid" or the mode is subscription and completed, treat as success.
        const paid = session.payment_status === "paid" || !!subscriptionId
        if (!paid) {
          console.warn("Webhook: session not paid; skipping activation", {
            trainerId,
            payment_status: session.payment_status,
            checkoutSessionId,
          })
          return NextResponse.json({ received: true, handled: false })
        }

        const result = await updateTrainerInPlace(trainerId, { checkoutSessionId, subscriptionId, invoiceId })
        console.log("Webhook: checkout.session.completed handled", { trainerId, result })
        break
      }

      // Optional redundancy for invoices paid in subscription flow
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id
        if (!subscriptionId) {
          return NextResponse.json({ received: true, handled: false })
        }

        // Try to connect invoice back to a session (best effort).
        const sessions = await stripe.checkout.sessions
          .list({ subscription: subscriptionId, limit: 1 })
          .catch(() => ({ data: [] as Stripe.Checkout.Session[] }))
        const session = sessions.data[0]
        const trainerId = session?.client_reference_id

        if (trainerId) {
          const result = await updateTrainerInPlace(trainerId, {
            subscriptionId,
            invoiceId: invoice.id,
            checkoutSessionId: session.id,
          })
          console.log("Webhook: invoice.payment_succeeded handled", { trainerId, result })
        }
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
