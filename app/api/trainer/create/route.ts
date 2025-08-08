import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, email, phone, city, district, specialty, certifications, bio, services } = body

    // Validate required fields (updated for new structure)
    if (!fullName || !email || !city || !district || !specialty) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Full name, email, city, district, and specialty are required",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Validate city and district are not empty strings
    if (city.trim().length === 0 || district.trim().length === 0) {
      return NextResponse.json(
        {
          error: "City and district cannot be empty",
        },
        { status: 400 },
      )
    }

    // Create temp trainer with new field structure
    const tempId = await TrainerService.createTempTrainer({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      city: city.trim(),
      district: district.trim(),
      specialty: specialty.trim(),
      certifications: certifications?.trim() || "",
      bio: bio?.trim() || "",
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
    return NextResponse.json(
      {
        error: "Failed to create trainer profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
