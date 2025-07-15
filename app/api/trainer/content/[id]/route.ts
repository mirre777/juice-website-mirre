import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log("Fetching trainer content for:", id)

    // Try to get active trainer first
    const trainerDoc = await db.collection("trainers").doc(id).get()

    if (!trainerDoc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!

    // Check if trainer is active and has content
    if (trainerData.status === "active" && trainerData.content) {
      return NextResponse.json({
        success: true,
        trainer: trainerData,
        content: trainerData.content,
      })
    }

    // If temp trainer or no content, return basic data
    return NextResponse.json({
      success: true,
      trainer: trainerData,
      content: null,
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch trainer content",
      },
      { status: 500 },
    )
  }
}
