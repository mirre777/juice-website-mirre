import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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
    console.error("Firebase initialization error:", error)
  }
}

const db = getFirestore()

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const { tempId } = params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  try {
    console.log("=== TEMP TRAINER API DEBUG ===")
    console.log("1. Received tempId:", tempId)
    console.log("2. Has token:", !!token)

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.log("3. Trainer not found in Firebase:", tempId)
      return NextResponse.json({ success: false, error: "Trainer profile not found" }, { status: 404 })
    }

    const trainerData = docSnap.data()

    if (!trainerData) {
      return NextResponse.json({ success: false, error: "Invalid trainer data" }, { status: 404 })
    }

    console.log("4. Found trainer:", {
      name: trainerData.name,
      status: trainerData.status,
      hasExpiresAt: !!trainerData.expiresAt,
    })

    if (token && trainerData.sessionToken !== token) {
      console.log("5. Invalid token provided")
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 })
    }

    if (trainerData.expiresAt) {
      const expiresAt = new Date(trainerData.expiresAt)
      if (expiresAt < new Date()) {
        console.log("6. Trainer expired")
        return NextResponse.json({ success: false, error: "Trainer profile has expired" }, { status: 410 })
      }
    }

    const trainer = {
      ...trainerData,
      id: docSnap.id,
      createdAt: trainerData.createdAt?.toDate?.()?.toISOString() || trainerData.createdAt,
    }

    console.log("7. Returning trainer data successfully")

    return NextResponse.json({
      success: true,
      trainer,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trainer profile" }, { status: 500 })
  }
}
