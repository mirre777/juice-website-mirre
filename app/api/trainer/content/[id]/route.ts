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

    // Get trainer document
    const trainerDoc = await db.collection("trainers").doc(id).get()

    if (!trainerDoc.exists) {
      console.log("Trainer not found:", id)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!

    if (!trainerData.isActive) {
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    console.log("Trainer content found:", trainerData.name)

    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerData.id,
        name: trainerData.name,
        fullName: trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
        specialization: trainerData.specialization,
        experience: trainerData.experience,
        bio: trainerData.bio,
        certifications: trainerData.certifications,
        content: trainerData.content,
        isActive: trainerData.isActive,
        activatedAt: trainerData.activatedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}
