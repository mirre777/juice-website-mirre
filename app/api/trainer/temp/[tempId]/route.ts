import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!tempId) {
      return NextResponse.json({ success: false, error: "Temp ID is required" }, { status: 400 })
    }

    // Get the temp trainer document
    const tempTrainerRef = doc(db, "tempTrainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = tempTrainerSnap.data()

    // Check if token is provided and matches (for secure access)
    if (token && trainerData.sessionToken !== token) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 403 })
    }

    // Check if the temp trainer has expired (24 hours)
    const now = new Date()
    const expiresAt =
      trainerData.expiresAt?.toDate() || new Date(trainerData.createdAt.toDate().getTime() + 24 * 60 * 60 * 1000)

    if (now > expiresAt) {
      return NextResponse.json({ success: false, error: "Trainer preview has expired" }, { status: 410 })
    }

    // Return the trainer data
    const responseData = {
      id: tempId,
      name: trainerData.fullName || trainerData.name || "Unknown Trainer",
      fullName: trainerData.fullName || trainerData.name || "Unknown Trainer",
      email: trainerData.email || "",
      phone: trainerData.phone || "",
      location: trainerData.location || "",
      specialization: trainerData.specialization || "Personal Training",
      experience: trainerData.experience || "Less than 1 year Experience",
      bio: trainerData.bio || "Passionate fitness professional dedicated to helping clients achieve their goals.",
      certifications: trainerData.certifications || ["Certified Personal Trainer"],
      createdAt: trainerData.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: trainerData.isActive || false,
      sessionToken: trainerData.sessionToken,
    }

    return NextResponse.json({
      success: true,
      trainer: responseData,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
