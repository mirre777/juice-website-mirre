import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { z } from "zod"
import { logger } from "@/lib/logger"

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
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  const userAgent = request.headers.get("user-agent") || "unknown"
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  logger.info("Trainer creation request started", {
    requestId,
    userAgent,
    ipAddress,
    timestamp: new Date().toISOString(),
  })

  try {
    const body = await request.json()

    logger.debug("Trainer form data received", {
      requestId,
      email: body.email,
      specialty: body.specialty,
      location: body.location,
      servicesCount: body.services?.length || 0,
      hasPhone: !!body.phone,
      hasCertifications: !!body.certifications,
      bioLength: body.bio?.length || 0,
    })

    // Validate form data with enhanced error handling
    const validationResult = TrainerFormSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn("Trainer form validation failed", {
        email: body.email,
        errors: validationResult.error.errors,
        timestamp: new Date().toISOString(),
      })

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

    // Create temporary trainer document
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiration

    const tempTrainerData = {
      ...formData,
      status: "temp",
      createdAt: serverTimestamp(),
      expiresAt: expiresAt,
      sessionToken: generateSessionToken(),
      isActive: false,
      isPaid: false,
    }

    logger.info("Creating temporary trainer document", {
      email: formData.email,
      expiresAt: expiresAt.toISOString(),
      sessionToken: tempTrainerData.sessionToken.substring(0, 8) + "...", // Log partial token for security
    })

    // Add to Firebase
    const docRef = await addDoc(collection(db, "trainers"), tempTrainerData)
    const tempId = docRef.id

    logger.info("Temporary trainer document created successfully", {
      tempId,
      email: formData.email,
      specialty: formData.specialty,
      expiresAt: expiresAt.toISOString(),
    })

    // Generate redirect URL
    const redirectUrl = `/marketplace/trainer/temp/${tempId}?token=${tempTrainerData.sessionToken}`

    logger.info("Trainer creation completed, sending redirect", {
      tempId,
      email: formData.email,
      redirectUrl: redirectUrl.split("?")[0], // Don't log the token
    })

    return NextResponse.json({
      success: true,
      tempId,
      redirectUrl,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    const processingTime = Date.now() - startTime

    logger.error("Trainer creation API error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
