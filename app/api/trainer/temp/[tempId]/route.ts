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

    console.log("Temp trainer API called", { tempId, hasToken: !!token })

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    console.log("Fetching trainer document", { tempId })

    // Get the temp trainer document
    const trainerDoc = await db.collection("trainers").doc(tempId).get()

    if (!trainerDoc.exists) {
      console.log("Trainer document not found:", tempId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!

    console.log("Trainer document retrieved", {
      tempId,
      hasSessionToken: !!trainerData.sessionToken,
      status: trainerData.status,
    })

    // Validate session token if provided
    if (token && trainerData.sessionToken !== token) {
      console.log("Invalid session token")
      return NextResponse.json({ error: "Invalid session token" }, { status: 403 })
    }

    // Check if trainer is still temporary and not expired
    if (trainerData.status !== "temp") {
      console.log("Trainer is not in temp status:", trainerData.status)
      return NextResponse.json({ error: "Trainer is not in preview mode" }, { status: 400 })
    }

    const expiresAt = new Date(trainerData.expiresAt)
    if (expiresAt < new Date()) {
      console.log("Trainer preview has expired")
      return NextResponse.json({ error: "Preview has expired" }, { status: 410 })
    }

    console.log("Temp trainer data returned successfully", { tempId })

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
        services: trainerData.services,
        expiresAt: trainerData.expiresAt,
        createdAt: trainerData.createdAt,
        status: trainerData.status,
        isActive: trainerData.isActive || false,
        sessionToken: trainerData.sessionToken,
      },
    })
  } catch (error: any) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch trainer data" }, { status: 500 })
  }
}
