import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface TrainerFormData {
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  pricing?: string
  socialMedia: {
    instagram?: string
    facebook?: string
    website?: string
  }
}

// Mock function to simulate trainer creation when Firebase is not available
function createMockTrainer(data: TrainerFormData) {
  const tempId = `temp_${Math.random().toString(36).substr(2, 12)}`
  const sessionToken = Math.random().toString(36).substr(2, 32)

  console.log("Mock trainer created:", {
    tempId,
    email: data.email,
    fullName: data.fullName,
    specialty: data.specialty,
    location: data.location,
    servicesCount: data.services.length,
    hasPhone: !!data.phone,
    hasCertifications: !!data.certifications,
    bioLength: data.bio.length,
  })

  return {
    success: true,
    tempId,
    sessionToken,
    message: "Trainer profile created successfully (mock mode)",
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "email", "location", "specialty", "experience", "bio", "services"]
    const missingFields = requiredFields.filter(
      (field) => !body[field] || (Array.isArray(body[field]) && body[field].length === 0),
    )

    if (missingFields.length > 0) {
      console.warn("Form validation failed:", {
        errors: missingFields,
        email: body.email,
        specialty: body.specialty,
      })

      return NextResponse.json(
        {
          error: "Missing required fields",
          validationErrors: missingFields,
        },
        { status: 400 },
      )
    }

    // Additional validation
    const validationErrors: string[] = []

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      validationErrors.push("email")
    }

    if (body.location && body.location.trim().length < 5) {
      validationErrors.push("location")
    }

    if (body.bio && body.bio.trim().length < 50) {
      validationErrors.push("bio")
    }

    if (validationErrors.length > 0) {
      console.warn("Form validation failed:", {
        errors: validationErrors,
        email: body.email,
        validationErrors,
      })

      return NextResponse.json(
        {
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 },
      )
    }

    console.log("Form submission started:", {
      email: body.email,
      specialty: body.specialty,
      location: body.location,
      servicesCount: body.services?.length || 0,
      hasPhone: !!body.phone,
      hasCertifications: !!body.certifications,
      bioLength: body.bio?.length || 0,
    })

    // Check if we have real Firebase configuration
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock mode - Firebase not configured")
      const result = createMockTrainer(body as TrainerFormData)
      return NextResponse.json(result)
    }

    // Create trainer document in Firestore
    try {
      const trainerData = {
        ...body,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "pending",
        isActive: false,
        tempId: `temp_${Math.random().toString(36).substr(2, 12)}`,
        sessionToken: Math.random().toString(36).substr(2, 32),
      }

      const docRef = await addDoc(collection(db, "trainers"), trainerData)

      console.log("Trainer created successfully:", {
        id: docRef.id,
        tempId: trainerData.tempId,
        email: body.email,
      })

      return NextResponse.json({
        success: true,
        id: docRef.id,
        tempId: trainerData.tempId,
        sessionToken: trainerData.sessionToken,
        message: "Trainer profile created successfully",
      })
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError)

      // Fallback to mock mode if Firebase fails
      console.log("Falling back to mock mode due to Firebase error")
      const result = createMockTrainer(body as TrainerFormData)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error("Trainer creation failed:", error)

    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
