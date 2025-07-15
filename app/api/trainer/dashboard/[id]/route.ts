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

    console.log("Fetching trainer dashboard data for:", id)

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

    console.log("Trainer dashboard data found:", trainerData.name)

    // Return dashboard data
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
        content: trainerData.content,
        isActive: trainerData.isActive,
        activatedAt: trainerData.activatedAt,
        paymentIntentId: trainerData.paymentIntentId,
        status: trainerData.status,
      },
      stats: {
        profileViews: Math.floor(Math.random() * 100) + 50,
        contactRequests: Math.floor(Math.random() * 20) + 5,
        lastUpdated: trainerData.updatedAt || trainerData.activatedAt,
      },
    })
  } catch (error: any) {
    console.error("Error fetching trainer dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log("Updating trainer:", id, updates)

    // Get trainer document
    const trainerRef = db.collection("trainers").doc(id)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!

    if (!trainerData.isActive) {
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    // Update the trainer document
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await trainerRef.update(updatedData)

    console.log("Trainer updated successfully:", id)

    return NextResponse.json({
      success: true,
      message: "Trainer updated successfully",
      trainer: {
        ...trainerData,
        ...updatedData,
      },
    })
  } catch (error: any) {
    console.error("Error updating trainer:", error)
    return NextResponse.json({ error: "Failed to update trainer" }, { status: 500 })
  }
}
