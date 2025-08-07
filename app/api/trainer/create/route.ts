import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"

export async function POST(request: NextRequest) {
  console.log("🚀 [TRAINER CREATE API] Starting request processing...")
  
  try {
    console.log("📥 [TRAINER CREATE API] Parsing request body...")
    const body = await request.json()
    console.log("✅ [TRAINER CREATE API] Request body parsed successfully:", {
      hasFullName: !!body.fullName,
      hasEmail: !!body.email,
      hasPhone: !!body.phone,
      hasCity: !!body.city,
      hasDistrict: !!body.district,
      hasSpecialty: !!body.specialty,
      hasCertifications: !!body.certifications,
      hasBio: !!body.bio,
      servicesCount: body.services?.length || 0,
      fullBody: body
    })

    const { fullName, email, phone, city, district, specialty, certifications, bio, services } = body

    console.log("🔍 [TRAINER CREATE API] Validating required fields...")
    
    // Validate required fields (updated for new structure)
    if (!fullName || !email || !city || !district || !specialty) {
      console.log("❌ [TRAINER CREATE API] Missing required fields:", {
        fullName: !!fullName,
        email: !!email,
        city: !!city,
        district: !!district,
        specialty: !!specialty
      })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Full name, email, city, district, and specialty are required",
        },
        { status: 400 },
      )
    }

    console.log("✅ [TRAINER CREATE API] Required fields validation passed")

    // Validate email format
    console.log("🔍 [TRAINER CREATE API] Validating email format...")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ [TRAINER CREATE API] Invalid email format:", email)
      return NextResponse.json(
        {
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    console.log("✅ [TRAINER CREATE API] Email format validation passed")

    // Validate city and district are not empty strings
    console.log("🔍 [TRAINER CREATE API] Validating city and district...")
    if (city.trim().length === 0 || district.trim().length === 0) {
      console.log("❌ [TRAINER CREATE API] Empty city or district:", {
        cityLength: city.trim().length,
        districtLength: district.trim().length
      })
      return NextResponse.json(
        {
          error: "City and district cannot be empty",
        },
        { status: 400 },
      )
    }

    console.log("✅ [TRAINER CREATE API] City and district validation passed")

    // Prepare trainer data
    const trainerData = {
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
    }

    console.log("📋 [TRAINER CREATE API] Prepared trainer data:", trainerData)

    // Check if TrainerService is available
    console.log("🔍 [TRAINER CREATE API] Checking TrainerService availability...")
    if (!TrainerService) {
      console.log("❌ [TRAINER CREATE API] TrainerService is not available")
      return NextResponse.json(
        {
          error: "Service unavailable",
          details: "TrainerService is not properly initialized",
        },
        { status: 500 },
      )
    }

    console.log("✅ [TRAINER CREATE API] TrainerService is available")

    // Check if createTempTrainer method exists
    console.log("🔍 [TRAINER CREATE API] Checking createTempTrainer method...")
    if (typeof TrainerService.createTempTrainer !== 'function') {
      console.log("❌ [TRAINER CREATE API] createTempTrainer method not found")
      return NextResponse.json(
        {
          error: "Service method unavailable",
          details: "createTempTrainer method is not available",
        },
        { status: 500 },
      )
    }

    console.log("✅ [TRAINER CREATE API] createTempTrainer method is available")

    // Create temp trainer with new field structure
    console.log("🚀 [TRAINER CREATE API] Calling TrainerService.createTempTrainer...")
    const tempId = await TrainerService.createTempTrainer(trainerData)
    console.log("✅ [TRAINER CREATE API] Temp trainer created successfully with ID:", tempId)

    const redirectUrl = `/marketplace/trainer/temp/${tempId}`
    console.log("🔗 [TRAINER CREATE API] Generated redirect URL:", redirectUrl)

    const response = {
      success: true,
      tempId,
      redirectUrl,
      message: "Trainer profile created successfully",
    }

    console.log("✅ [TRAINER CREATE API] Sending success response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.log("💥 [TRAINER CREATE API] Error caught in main try-catch:")
    console.log("Error type:", typeof error)
    console.log("Error constructor:", error?.constructor?.name)
    console.log("Error message:", error instanceof Error ? error.message : String(error))
    console.log("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    console.log("Full error object:", error)

    // Try to get more details about the error
    if (error instanceof Error) {
      console.log("📊 [TRAINER CREATE API] Error details:")
      console.log("- Name:", error.name)
      console.log("- Message:", error.message)
      console.log("- Stack:", error.stack)
      
      // Check for specific error types
      if (error.message.includes('Firebase')) {
        console.log("🔥 [TRAINER CREATE API] Firebase-related error detected")
      }
      if (error.message.includes('network')) {
        console.log("🌐 [TRAINER CREATE API] Network-related error detected")
      }
      if (error.message.includes('permission')) {
        console.log("🔒 [TRAINER CREATE API] Permission-related error detected")
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create trainer profile",
        details: error instanceof Error ? error.message : "Unknown error",
        errorType: error?.constructor?.name || "Unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
