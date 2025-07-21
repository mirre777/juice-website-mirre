import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, email, phone, location, experience, specialty, certifications, bio, services } = body

    // Validate required fields
    if (!fullName || !email || !phone || !location || !experience || !specialty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create temp trainer
    const tempId = await TrainerService.createTempTrainer({
      fullName,
      email,
      phone,
      location,
      experience,
      specialty,
      certifications: certifications || "",
      bio: bio || "",
      services: services || [],
      status: "pending",
    })

    const redirectUrl = `/marketplace/trainer/temp/${tempId}`

    return NextResponse.json({
      success: true,
      tempId,
      redirectUrl,
      message: "Trainer profile created successfully",
    })
  } catch (error) {
    console.error("Error creating trainer:", error)
    return NextResponse.json({ error: "Failed to create trainer profile" }, { status: 500 })
  }
}
