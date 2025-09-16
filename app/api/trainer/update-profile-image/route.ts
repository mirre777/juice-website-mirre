import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const { trainerId, profileImage } = await request.json()

    if (!trainerId || !profileImage) {
      return NextResponse.json({ error: "Trainer ID and profile image URL are required" }, { status: 400 })
    }

    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    // Update trainer document with new profile image
    const trainerRef = doc(db, "trainers", trainerId)
    await updateDoc(trainerRef, {
      profileImage,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile image update error:", error)
    return NextResponse.json({ error: "Failed to update profile image" }, { status: 500 })
  }
}
