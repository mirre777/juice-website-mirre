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
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("Fetching temp trainer:", { tempId, hasToken: !!token })

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    // Get temp trainer document
    const tempDoc = await db.collection("tempTrainers").doc(tempId).get()

    if (!tempDoc.exists) {
      console.log("Temp trainer not found:", tempId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempData = tempDoc.data()!
    console.log("Found temp trainer:", tempData.name)

    // Verify token if provided
    if (token && tempData.sessionToken !== token) {
      console.log("Invalid token for temp trainer:", tempId)
      return NextResponse.json({ error: "Invalid access token" }, { status: 403 })
    }

    // Check if expired
    const expiresAt = new Date(tempData.expiresAt)
    const now = new Date()

    if (now > expiresAt) {
      console.log("Temp trainer expired:", tempId)
      return NextResponse.json({ error: "Preview has expired" }, { status: 410 })
    }

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
        services: tempData.services,
        expiresAt: tempData.expiresAt,
        sessionToken: tempData.sessionToken,
        createdAt: tempData.createdAt,
      },
    })
  } catch (error: any) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: "Failed to fetch trainer data" }, { status: 500 })
  }
}
