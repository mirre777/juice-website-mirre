import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, email, phone, location, experience, certifications, specialty, bio, services } = body

    // Validate required fields
    if (!fullName || !email || !phone || !location || !experience || !certifications || !specialty || !bio) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("Creating temp trainer for:", fullName)

    const tempId = await TrainerService.createTempTrainer({
      fullName,
      email,
      phone,
      location,
      experience,
      certifications,
      specialty,
      bio,
      services: services || [],
      status: "pending",
    })

    const redirectUrl = `/marketplace/trainer/temp/${tempId}`

    console.log("Created temp trainer with ID:", tempId)
    console.log("Redirect URL:", redirectUrl)

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
