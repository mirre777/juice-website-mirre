import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  }

  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

const db = getFirestore()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    console.log("Fetching trainer content for ID:", trainerId)

    // Try to find the trainer in the trainers collection
    const trainerRef = db.collection("trainers").doc(trainerId)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      console.log("Trainer not found:", trainerId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!
    console.log("Found trainer:", trainerData.name, "Status:", trainerData.status)

    // Check if trainer is active
    if (trainerData.status !== "active" || !trainerData.isActive) {
      console.log("Trainer not active:", trainerId)
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    // Return the trainer data with generated content
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
        isPaid: trainerData.isPaid,
        status: trainerData.status,
      },
    })
  } catch (error: any) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}
