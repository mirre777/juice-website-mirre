import { type NextRequest, NextResponse } from "next/navigation"
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

    console.log("Fetching trainer content for ID:", id)

    // Try to get active trainer first
    const trainerDoc = await db.collection("trainers").doc(id).get()

    if (!trainerDoc.exists) {
      console.log("Active trainer not found, checking temp trainers")
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!

    // Check if trainer is active and has content
    if (trainerData.status === "active" && trainerData.isActive && trainerData.content) {
      console.log("Returning active trainer content")
      return NextResponse.json({
        success: true,
        trainer: trainerData,
        content: trainerData.content,
      })
    }

    // If trainer exists but not active, return basic info
    console.log("Trainer found but not active:", trainerData.status)
    return NextResponse.json({
      success: false,
      error: "Trainer profile not activated",
      trainer: {
        id: trainerData.id,
        name: trainerData.name,
        status: trainerData.status,
        isActive: trainerData.isActive || false,
      },
    })
  } catch (error: any) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch trainer content" }, { status: 500 })
  }
}
