import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin exactly once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Support both literal "\n" and actual newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

/**
 * Helper to build a safe JSON response shape consistently across the route.
 */
function json(
  body: Record<string, any>,
  init?: { status?: number; headers?: Record<string, string> },
) {
  return NextResponse.json(
    body,
    {
      status: init?.status ?? 200,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    },
  )
}

/**
 * Helper to determine if a preview has expired.
 * Accepts ISO string or Date; returns boolean.
 */
function isExpired(expiresAt?: string | Date | null) {
  if (!expiresAt) return false
  try {
    const ts = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt
    if (Number.isNaN(ts.getTime())) return false
    return ts.getTime() < Date.now()
  } catch {
    return false
  }
}

/**
 * GET /api/trainer/temp/:tempId
 * - Reads from the "trainers" collection using the provided tempId.
 * - Returns 200 with { success: true, trainer } when found and not expired.
 * - Returns 410 with { success: false, code: "EXPIRED" } when expired.
 * - Returns 404 with { success: false } when not found.
 * - Never throws a 500 for expected conditions; all responses are JSON.
 */
export async function GET(_request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    if (!tempId) {
      return json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    // Fetch the trainer doc directly from "trainers"
    const docRef = db.collection("trainers").doc(tempId)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = snapshot.data() || {}

    // Guard: Only allow preview for temp/draft trainers (do not change design/flow here)
    // We keep returning the trainer even if it's already active, so existing preview UI continues to work.
    // If you want to redirect to live later, do that in a later phase.

    // Preview expiration check
    if (isExpired(trainer.expiresAt)) {
      // Return a structured "expired" response (410 Gone), not a 500
      return json(
        {
          success: false,
          error: "Preview expired",
          code: "EXPIRED",
          // You can optionally include where to go next; UI can decide what to do
          // redirectTo: "/marketplace/personal-trainer-website",
        },
        { status: 410 },
      )
    }

    return json({ success: true, trainer }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error in GET /api/trainer/temp/[tempId]:", error?.message || error)
    // Return a structured 500 JSON instead of leaking plain text
    return json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/trainer/temp/:tempId
 * - Safely updates content for a temp trainer doc in "trainers".
 * - Rejects updates for already activated/paid trainers (points the client to use live endpoints).
 * - Returns JSON for all outcomes, avoiding 500 for expected conditions.
 */
export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    if (!tempId) {
      return json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    let payload: any = null
    try {
      payload = await request.json()
    } catch {
      return json({ success: false, error: "Invalid JSON body" }, { status: 400 })
    }

    const { content } = payload || {}
    if (!content) {
      return json({ success: false, error: "Content is required" }, { status: 400 })
    }

    const docRef = db.collection("trainers").doc(tempId)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = snapshot.data() || {}

    // Do not allow editing via temp endpoint if already active/paid
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

    // Optional: also block updates if preview expired (keeps flow consistent)
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

    await docRef.set(
      {
        content,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    return json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error in PUT /api/trainer/temp/[tempId]:", error?.message || error)
    return json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
