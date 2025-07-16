import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { z } from "zod"

// Enhanced validation schema
const TrainerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().optional(),
  location: z.string().min(5, "Location must be at least 5 characters").trim(),
  specialty: z.string().min(1, "Please select a specialty"),
  experience: z.string().min(1, "Please select experience level"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio must be less than 500 characters"),
  certifications: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
})

// Generate a secure session token
function generateSessionToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.random() * chars.length)
  }
  return result
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  console.log(`[${new Date().toISOString()}] INFO: Trainer creation request started | ${JSON.stringify({ requestId })}`)

  try {
    const body = await request.json()

    console.log(
      `[${new Date().toISOString()}] DEBUG: Form data received | ${JSON.stringify({
        requestId,
        email: body.email,
        specialty: body.specialty,
        location: body.location,
        servicesCount: body.services?.length || 0,
        bioLength: body.bio?.length || 0,
      })}`,
    )

    // Validate form data
    const validationResult = TrainerFormSchema.safeParse(body)

    if (!validationResult.success) {
      console.log(
        `[${new Date().toISOString()}] WARN: Validation failed | ${JSON.stringify({
          requestId,
          email: body.email,
          errors: validationResult.error.errors,
        })}`,
      )

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const formData = validationResult.data

    // Create expiration date (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const sessionToken = generateSessionToken()

    // Prepare the data with proper serialization
    // Note: We use serverTimestamp() for createdAt but a regular Date for expiresAt
    const tempTrainerData = {
      // Basic trainer info
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
      location: formData.location,
      specialty: formData.specialty,
      experience: formData.experience,
      bio: formData.bio,
      certifications: formData.certifications || "",
      services: formData.services, // This is already an array from validation

      // Status and metadata
      status: "temp",
      createdAt: serverTimestamp(), // Use serverTimestamp for creation time
      expiresAt: expiresAt, // Use regular Date object for expiration
      sessionToken: sessionToken,
      isActive: false,
      isPaid: false,

      // Additional metadata
      requestId: requestId,
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    console.log(
      `[${new Date().toISOString()}] INFO: Creating trainer document | ${JSON.stringify({
        requestId,
        email: formData.email,
        expiresAt: expiresAt.toISOString(),
        dataKeys: Object.keys(tempTrainerData),
        servicesCount: formData.services.length,
      })}`,
    )

    // Add to Firebase with enhanced error handling
    let docRef
    try {
      const trainersCollection = collection(db, "trainers")
      console.log(
        `[${new Date().toISOString()}] DEBUG: Collection reference created | ${JSON.stringify({
          requestId,
          collectionPath: "trainers",
        })}`,
      )

      docRef = await addDoc(trainersCollection, tempTrainerData)

      console.log(
        `[${new Date().toISOString()}] INFO: Document created successfully | ${JSON.stringify({
          requestId,
          docId: docRef.id,
          email: formData.email,
        })}`,
      )
    } catch (firebaseError: any) {
      console.error(
        `[${new Date().toISOString()}] ERROR: Firebase write failed | ${JSON.stringify({
          requestId,
          error: firebaseError.message,
          code: firebaseError.code,
          stack: firebaseError.stack,
        })}`,
      )

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create trainer profile. Please try again.",
          details: firebaseError.message,
          code: firebaseError.code,
          requestId,
        },
        { status: 500 },
      )
    }

    const tempId = docRef.id
    const redirectUrl = `/marketplace/trainer/temp/${tempId}?token=${sessionToken}`

    console.log(
      `[${new Date().toISOString()}] INFO: Trainer creation completed | ${JSON.stringify({
        requestId,
        tempId,
        email: formData.email,
        processingTime: Date.now() - startTime,
      })}`,
    )

    return NextResponse.json({
      success: true,
      tempId,
      redirectUrl,
      expiresAt: expiresAt.toISOString(),
      requestId,
    })
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] ERROR: Trainer creation API error | ${JSON.stringify({
        requestId,
        error: error.message,
        stack: error.stack,
        processingTime: Date.now() - startTime,
      })}`,
    )

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again.",
        requestId,
      },
      { status: 500 },
    )
  }
}
