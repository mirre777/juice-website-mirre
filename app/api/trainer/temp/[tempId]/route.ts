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

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    console.log("Fetching temp trainer data for:", tempId)

    // Get temp trainer document
    const tempDoc = await db.collection("trainers").doc(tempId).get()

    if (!tempDoc.exists) {
      console.log("Temp trainer not found:", tempId)
      return NextResponse.json({ error: "Temp trainer not found" }, { status: 404 })
    }

    const tempData = tempDoc.data()!
    console.log("Temp trainer data found:", tempData.name)

    return NextResponse.json({
      success: true,
      trainer: {
        id: tempData.id,
        name: tempData.name,
        fullName: tempData.fullName,
        email: tempData.email,
        phone: tempData.phone,
        location: tempData.location,
        specialization: tempData.specialization,
        experience: tempData.experience,
        bio: tempData.bio,
        certifications: tempData.certifications,
        status: tempData.status,
        createdAt: tempData.createdAt,
        expiresAt: tempData.expiresAt,
        hasSessionToken: !!tempData.sessionToken,
      },
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: "Failed to fetch temp trainer" }, { status: 500 })
  }
}
