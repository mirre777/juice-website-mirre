import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// ---------- Stripe client ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// ---------- Firebase Admin (singleton) ----------
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Support escaped newlines in env var
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}
const db = getFirestore()

// ---------- Helpers ----------
type ActivationExtras = {
  mode: "pi" | "checkout" | "invoice"
  paymentIntentId?: string
  subscriptionId?: string
  sessionId?: string
  invoiceId?: string
}

/**
 * Idempotent in-place activation: updates the existing trainers/{trainerId} document.
 * - Sets status: "active", isActive: true, isPaid: true
 * - Stores Stripe references depending on the flow (PI, subscription, invoice)
 * - If already active/paid, it's a no-op aside from backfilling missing identifiers and timestamps
 */
async function activateTrainerInPlace(trainerId: string, extras: ActivationExtras) {
  const ref = db.collection("trainers").doc(trainerId)
  const snap = await ref.get()

  if (!snap.exists) {
    console.warn("[webhook] Trainer doc not found:", { trainerId, extras })
    return { updated: false, reason: "not-found" as const }
  }

  const existing = snap.data() || {}
  const alreadyActive = existing?.status === "active" || existing?.isActive === true || existing?.isPaid === true

  const update: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  }

  // Backfill Stripe references regardless of state
  if (extras.paymentIntentId) update.paymentIntentId = extras.paymentIntentId
  if (extras.subscriptionId) update.subscriptionId = extras.subscriptionId
  if (extras.sessionId) update.checkoutSessionId = extras.sessionId
  if (extras.invoiceId) update.invoiceId = extras.invoiceId

  if (!alreadyActive) {
    update.status = "active"
    update.isActive = true
    update.isPaid = true
    if (!existing.activatedAt) update.activatedAt = new Date().toISOString()
  }

  await ref.set(update, { merge: true })

  if (alreadyActive) {
    console.log("[webhook] Trainer already active/paid; backfilled refs if needed:", {
      trainerId,
      extras,
    })
    return { updated: false, reason: "already-active" as const }
  }

  console.log("[webhook] Trainer activated in-place:", { trainerId, extras })
  return { updated: true as const }
}

/**
 * Resolve trainerId from a PaymentIntent, falling back to related Checkout Session if necessary.
 */
async function resolveTrainerIdFromPaymentIntent(piId: string, pi?: Stripe.PaymentIntent) {
  const paymentIntent =
    pi ??
    (await stripe.paymentIntents.retrieve(piId).catch((e) => {
      console.error("[webhook] Failed to retrieve PaymentIntent:", e?.message)
      return undefined
    }))

  let trainerId: string | undefined
  if (paymentIntent?.metadata) {
    trainerId = (paymentIntent.metadata as any).trainerId || (paymentIntent.metadata as any).tempId
  }

  if (!trainerId) {
    // Try to find a Checkout Session associated with this PaymentIntent
    const sessions = await stripe.checkout.sessions.list({ payment_intent: piId, limit: 1 }).catch((e) => {
      console.error("[webhook] Failed to list sessions for PI:", e?.message)
      return { data: [] }
    })
    const session = sessions?.data?.[0]
    if (session?.client_reference_id) {
      trainerId = session.client_reference_id
    }
  }

  return trainerId
}

/**
 * Resolve a trainerId from a subscription or invoice by looking up the related Checkout Session(s).
 */
async function resolveTrainerIdFromSubscriptionOrInvoice(params: {
  subscriptionId?: string
  invoiceId?: string
}) {
  const { subscriptionId, invoiceId } = params
  let trainerId: string | undefined
  let sessionId: string | undefined

  if (subscriptionId) {
    // Find latest session that created/modified this subscription
    const sessions = await stripe.checkout.sessions.list({ subscription: subscriptionId, limit: 1 }).catch((e) => {
      console.error("[webhook] Failed to list sessions by subscription:", e?.message)
      return { data: [] }
    })
    const session = sessions?.data?.[0]
    if (session?.client_reference_id) {
      trainerId = session.client_reference_id
      sessionId = session.id
      return { trainerId, sessionId }
    }
  }

  if (invoiceId && !trainerId) {
    // Try searching invoice object for a linked session via lines or metadata (best-effort)
    // As a fallback, do nothing here; other events should cover activation.
    console.warn("[webhook] No session found via subscription; invoice fallback not implemented", {
      invoiceId,
    })
  }

  return { trainerId, sessionId }
}

// ---------- Route handler ----------
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    console.error("[webhook] Missing stripe-signature header")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  // Raw body is required for signature verification
  const body = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err?.message)
    return NextResponse.json({ error: `Webhook Error: ${err?.message}` }, { status: 400 })
  }

  console.log("[webhook] Event received:", event.type)

  try {
    switch (event.type) {
      // Payment Element flow (one-time PI)
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent
        const paymentIntentId = pi.id

        const trainerId =
          (pi.metadata as any)?.trainerId ||
          (pi.metadata as any)?.tempId ||
          (await resolveTrainerIdFromPaymentIntent(paymentIntentId, pi))

        if (!trainerId) {
          console.warn("[webhook] payment_intent.succeeded: missing trainerId", {
            paymentIntentId,
          })
          break // Return 200 to avoid retries; client fallback can handle it
        }

        await activateTrainerInPlace(trainerId, {
          mode: "pi",
          paymentIntentId,
        })
        break
      }

      // Checkout subscription flow (no PI on session)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Only proceed when Checkout reports paid or complete
        if (session.payment_status !== "paid") {
          console.warn("[webhook] Session completed but not paid:", {
            sessionId: session.id,
            payment_status: session.payment_status,
          })
          break
        }

        const trainerId = session.client_reference_id
        if (!trainerId) {
          console.warn("[webhook] checkout.session.completed: missing client_reference_id", {
            sessionId: session.id,
          })
          break
        }

        await activateTrainerInPlace(trainerId, {
          mode: "checkout",
          subscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
          sessionId: session.id,
          invoiceId: typeof session.invoice === "string" ? session.invoice : session.invoice?.id,
        })
        break
      }

      // Redundant activation path for subscriptions; useful when amount_total is 0 (promos)
      case "invoice.payment_succeeded":
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceId = invoice.id
        const subscriptionId =
          typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id

        const { trainerId, sessionId } = await resolveTrainerIdFromSubscriptionOrInvoice({
          subscriptionId,
          invoiceId,
        })

        if (!trainerId) {
          console.warn("[webhook] invoice event: unable to resolve trainerId", {
            invoiceId,
            subscriptionId,
          })
          break
        }

        await activateTrainerInPlace(trainerId, {
          mode: "invoice",
          subscriptionId,
          invoiceId,
          sessionId,
        })
        break
      }

      default:
        // Ignore other events
        break
    }

    // Always acknowledge to prevent Stripe retries (idempotency handled server-side)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[webhook] Handler error:", error)
    // Return 200 to avoid repeated retries if the error is not transient; adjust if you want retries
    return NextResponse.json({ received: true, handled: false })
  }
}
