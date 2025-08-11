import { type NextRequest, NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin if not already initialized
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

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    const doc = await db.collection("trainers").doc(tempId).get()
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = doc.data() as any

    // If expired, return 410 Gone with clear JSON
    if (trainer?.expiresAt) {
      const expiresAtMs = Date.parse(trainer.expiresAt)
      if (!Number.isNaN(expiresAtMs) && Date.now() > expiresAtMs) {
        return NextResponse.json({ success: false, error: "Preview expired" }, { status: 410 })
      }
    }

    return NextResponse.json({ success: true, trainer })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { content } = await request.json().catch(() => ({}))

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
    }

    const ref = db.collection("trainers").doc(tempId)
    const snap = await ref.get()
    if (!snap.exists) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainer = snap.data() as any
    if (trainer?.status === "active" && trainer?.isPaid) {
      return NextResponse.json(
        {
          success: false,
          error: "Trainer already activated",
          redirectTo: `/marketplace/trainer/${tempId}`,
        },
        { status: 400 },
      )
    }

    await ref.set(
      {
        content,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to update trainer content" }, { status: 500 })
  }
}
