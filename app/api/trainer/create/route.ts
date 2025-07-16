import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/app/api/firebase-config"
import { FieldValue } from "firebase-admin/firestore"
import { logger } from "@/lib/logger"
import crypto from "crypto"

// Validation schema
const trainerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().min(5, "Location must be at least 5 characters"),
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.string().min(1, "Experience level is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio must be less than 500 characters"),
  certifications: z.string().optional(),
  services: z.array(z.string()).min(1, "At least one service is required"),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomBytes(3).toString("hex")

  logger.info("Trainer creation request started", { requestId })

  try {
    const body = await request.json()

    logger.debug("Form data received", {
      requestId,
      email: body.email,
      specialty: body.specialty,
      location: body.location,
      servicesCount: body.services?.length || 0,
      hasPhone: !!body.phone,
      hasCertifications: !!body.certifications,
      bioLength: body.bio?.length || 0,
    })

    // Validate the data
    const validatedData = trainerSchema.parse(body)

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex")

    // Create temporary trainer data
    const tempTrainerData = {
      ...validatedData,
      status: "temp",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      sessionToken,
      isActive: false,
      isPaid: false,
      requestId,
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    logger.info("Creating trainer document", {
      requestId,
      email: validatedData.email,
      expiresAt: tempTrainerData.expiresAt.toISOString(),
      dataKeys: Object.keys(tempTrainerData),
      servicesCount: validatedData.services.length,
    })

    // Save to Firestore using Firebase Admin SDK syntax
    const trainersCollection = db.collection("trainers")
    const docRef = await trainersCollection.add(tempTrainerData)

    logger.info("Trainer document created successfully", {
      requestId,
      email: validatedData.email,
      docId: docRef.id,
      sessionToken: sessionToken.substring(0, 8) + "...", // Log partial token for debugging
    })

    // Generate the temporary URL
    const tempUrl = `/marketplace/trainer/temp/${docRef.id}?token=${sessionToken}`

    logger.info("Trainer creation completed", {
      requestId,
      email: validatedData.email,
      tempUrl,
      docId: docRef.id,
    })

    return NextResponse.json({
      success: true,
      tempId: docRef.id,
      redirectUrl: tempUrl,
      message: "Trainer profile created successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Validation failed", {
        requestId,
        errors: error.errors,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    logger.error("Firebase write failed", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && "code" in error ? error.code : "unknown",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create trainer profile. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
