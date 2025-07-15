import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

const db = getFirestore()

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("Fetching temp trainer:", { tempId, token })

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get the temp trainer document
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    if (!tempTrainerDoc.exists) {
      console.log("Temp trainer not found:", tempId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    // Verify the token
    if (tempTrainerData?.token !== token) {
      console.log("Invalid token for temp trainer:", {
        tempId,
        providedToken: token,
        expectedToken: tempTrainerData?.token,
      })
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Check if the temp trainer has expired (24 hours)
    const createdAt = tempTrainerData?.createdAt?.toDate()
    const now = new Date()
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      console.log("Temp trainer expired:", { tempId, hoursDiff })
      return NextResponse.json({ error: "Trainer preview has expired" }, { status: 410 })
    }

    // Return the trainer data
    const responseData = {
      id: tempId,
      name: tempTrainerData?.name || "Unknown Trainer",
      email: tempTrainerData?.email || "",
      specialization: tempTrainerData?.specialization || "Personal Trainer",
      bio: tempTrainerData?.bio || "",
      experience: tempTrainerData?.experience || "",
      certifications: tempTrainerData?.certifications || [],
      services: tempTrainerData?.services || [],
      pricing: tempTrainerData?.pricing || {},
      availability: tempTrainerData?.availability || {},
      location: tempTrainerData?.location || "",
      phone: tempTrainerData?.phone || "",
      website: tempTrainerData?.website || "",
      socialMedia: tempTrainerData?.socialMedia || {},
      images: tempTrainerData?.images || [],
      testimonials: tempTrainerData?.testimonials || [],
      content: tempTrainerData?.content || null,
      isActive: false, // Temp trainers are never active
      isPaid: tempTrainerData?.isPaid || false,
      createdAt: createdAt?.toISOString(),
      expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      token: tempTrainerData?.token,
    }

    console.log("Temp trainer data retrieved successfully:", { tempId, name: responseData.name })

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const body = await request.json()
    const { token, ...updateData } = body

    console.log("Updating temp trainer:", { tempId, token })

    if (!tempId) {
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get the temp trainer document
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    if (!tempTrainerDoc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    // Verify the token
    if (tempTrainerData?.token !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Update the temp trainer
    await tempTrainerRef.update({
      ...updateData,
      updatedAt: new Date(),
    })

    console.log("Temp trainer updated successfully:", tempId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating temp trainer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
