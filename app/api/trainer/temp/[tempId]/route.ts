/**
 * CRITICAL: READ docs/FIREBASE_BUILD_ISSUES.md BEFORE MAKING CHANGES
 * This file uses Firebase Admin SDK and requires build-time detection to prevent
 * initialization errors during Next.js builds.
 */

import { type NextRequest, NextResponse } from "next/server"

let firebaseAdminCache: any = null

async function getFirebaseAdmin() {
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.VERCEL_ENV === undefined ||
      process.env.CI === "true" ||
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-production-server" ||
      (typeof window === "undefined" && !process.env.VERCEL_URL) ||
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY)
  ) {
    console.log("Build time detected - completely skipping Firebase initialization in trainer temp route")
    return null
  }

  if (firebaseAdminCache) {
    return firebaseAdminCache
  }

  try {
    const { getApps, initializeApp, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      console.log("Missing Firebase credentials - skipping initialization")
      return null
    }

    // Initialize Firebase Admin once
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    }

    const db = getFirestore()
    firebaseAdminCache = { db }
    return firebaseAdminCache
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return null
  }
}

function json(body: Record<string, any>, init?: { status?: number; headers?: Record<string, string> }) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
}

function isExpired(expiresAt?: unknown) {
  if (!expiresAt) return false
  try {
    const dt = typeof expiresAt === "string" ? new Date(expiresAt) : (expiresAt as Date)
    return Number.isNaN(dt.getTime()) ? false : dt.getTime() < Date.now()
  } catch {
    return false
  }
}

/**
 * GET /api/trainer/temp/:tempId
 * - Reads directly from "trainers/:tempId"
 * - 200 with { success: true, trainer } when found and not expired
 * - 410 with { success: false, code: "EXPIRED" } when preview expired
 * - 404 with { success: false, error } when not found
 * - 500 only for unexpected errors (always JSON)
 */
export async function GET(_request: NextRequest, { params }: { params: { tempId: string } }) {
  const firebase = await getFirebaseAdmin()
  if (!firebase) {
    return json({ success: false, error: "Service temporarily unavailable" }, { status: 503 })
  }

  try {
    const { tempId } = params
    if (!tempId) {
      return json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    const ref = firebase.db.collection("trainers").doc(tempId)
    const snap = await ref.get()

    if (!snap.exists) {
      return json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = snap.data() || {}

    // Expiration check for preview
    if (isExpired(trainer.expiresAt)) {
      return json(
        {
          success: false,
          error: "Preview expired",
          code: "EXPIRED",
        },
        { status: 410 },
      )
    }

    // Keep returning trainer data for preview (no design/flow changes here)
    return json({ success: true, trainer })
  } catch (err: any) {
    console.error("❌ GET /api/trainer/temp/[tempId] error:", err?.message || err)
    return json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/trainer/temp/:tempId
 * - Updates temp trainer content in "trainers/:tempId" when not active/paid/expired
 * - 400 for missing inputs
 * - 404 when doc not found
 * - 410 when preview expired
 * - 400 when already activated (with redirect hint)
 * - 200 on success
 */
export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  const firebase = await getFirebaseAdmin()
  if (!firebase) {
    return json({ success: false, error: "Service temporarily unavailable" }, { status: 503 })
  }

  try {
    const { tempId } = params
    if (!tempId) {
      return json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return json({ success: false, error: "Invalid JSON body" }, { status: 400 })
    }

    const { content } = body || {}
    if (!content) {
      return json({ success: false, error: "Content is required" }, { status: 400 })
    }

    const ref = firebase.db.collection("trainers").doc(tempId)
    const snap = await ref.get()

    if (!snap.exists) {
      return json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = snap.data() || {}

    // Block edits when already live
    if (trainer.status === "active" || trainer.isActive === true || trainer.isPaid === true) {
      return json(
        {
          success: false,
          error: "Trainer already activated",
          redirectTo: `/marketplace/trainer/${tempId}`,
        },
        { status: 400 },
      )
    }

    // Block edits when expired
    if (isExpired(trainer.expiresAt)) {
      return json(
        {
          success: false,
          error: "Preview expired",
          code: "EXPIRED",
        },
        { status: 410 },
      )
    }

    await ref.set(
      {
        content,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    return json({ success: true })
  } catch (err: any) {
    console.error("❌ PUT /api/trainer/temp/[tempId] error:", err?.message || err)
    return json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
