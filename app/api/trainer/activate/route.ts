/**
 * IMPORTANT: Read docs/FIREBASE_BUILD_ISSUES.md before modifying Firebase code
 * This file uses build-time detection to prevent Firebase initialization during Next.js builds
 */

import { type NextRequest, NextResponse } from "next/server"

const isBuildTime = () => {
  return (
    process.env.NODE_ENV === "production" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.CI === "true" ||
      process.env.VERCEL_ENV === undefined ||
      (typeof window === "undefined" && !process.env.VERCEL_URL))
  )
}

async function getStripe() {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping Stripe initialization")
    throw new Error("Stripe not available during build time")
  }

  const { default: Stripe } = await import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })
}

async function getFirebaseDb() {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping Firebase initialization")
    throw new Error("Firebase not available during build time")
  }

  const [{ initializeApp, getApps, cert }, { getFirestore }] = await Promise.all([
    import("firebase-admin/app"),
    import("firebase-admin/firestore"),
  ])

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  }

  return getFirestore()
}

async function resolveTrainerIdFromPaymentIntent(paymentIntentId: string) {
  const stripe = await getStripe()
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

  let trainerId = (pi.metadata as any)?.trainerId || (pi.metadata as any)?.tempId || undefined

  if (!trainerId) {
    // Fall back to checkout session if used
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 })
    const session = sessions.data[0]
    if (session?.client_reference_id) {
      trainerId = session.client_reference_id
    }
  }
  return trainerId
}

async function activateTrainerDocInPlace(trainerId: string, paymentIntentId: string) {
  const db = await getFirebaseDb()
  const ref = db.collection("trainers").doc(trainerId)
  const snap = await ref.get()
  if (!snap.exists) {
    return { ok: false as const, status: 404, message: "Trainer not found" }
  }

  const data = snap.data() || {}
  if (data.isPaid === true || data.status === "active" || data.isActive === true) {
    // idempotent no-op
    await ref.set(
      {
        paymentIntentId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
    return { ok: true as const, trainerId, alreadyActive: true as const }
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
    { merge: true },
  )
  return { ok: true as const, trainerId }
}

/**
 * POST /api/trainer/activate
 * Body: { paymentIntentId: string }
 * Verifies payment with Stripe and flips status/isActive/isPaid on trainers/<trainerId> idempotently.
 */
export async function POST(request: NextRequest) {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping trainer activation route")
    return new Response("Build time - route disabled", { status: 503 })
  }

  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 })
    }

    const stripe = await getStripe()
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed", status: pi.status }, { status: 400 })
    }

    const trainerId =
      (pi.metadata as any)?.trainerId ||
      (pi.metadata as any)?.tempId ||
      (await resolveTrainerIdFromPaymentIntent(paymentIntentId))

    if (!trainerId) {
      return NextResponse.json({ error: "Unable to resolve trainerId from payment" }, { status: 400 })
    }

    const result = await activateTrainerDocInPlace(trainerId, paymentIntentId)
    if (!("ok" in result) || !result.ok) {
      return NextResponse.json({ error: result.message || "Activation failed" }, { status: result.status || 500 })
    }

    return NextResponse.json({ success: true, trainerId, alreadyActive: (result as any).alreadyActive === true })
  } catch (error: any) {
    console.error("Activation error:", error?.message || error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
