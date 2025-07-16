import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { FieldValue } from "firebase-admin/firestore"
import { logger } from "@/lib/logger"

interface TrainerFormData {
  fullName: string
  email: string
  phone: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications: string
  services: string[]
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 8)

  try {
    logger.info("Trainer creation request started", { requestId })

    const formData: TrainerFormData = await request.json()

    logger.debug("Form data received", {
      requestId,
      email: formData.email,
      specialty: formData.specialty,
      location: formData.location,
      servicesCount: formData.services?.length || 0,
      hasPhone: !!formData.phone,
      hasCertifications: !!formData.certifications,
      bioLength: formData.bio?.length || 0,
    })

    // Generate session token and expiry
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // Create temporary trainer document
    const tempTrainerData = {
      ...formData,
      status: "temp",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
      sessionToken,
      isActive: false,
      isPaid: false,
      requestId,
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    logger.info("Creating trainer document", {
      requestId,
      email: formData.email,
      expiresAt: expiresAt.toISOString(),
      dataKeys: Object.keys(tempTrainerData),
      servicesCount: formData.services?.length || 0,
    })

    // Use Firebase Admin SDK syntax
    const trainersCollection = db.collection("trainers")
    const docRef = await trainersCollection.add(tempTrainerData)

    const tempId = docRef.id

    logger.info("Trainer document created successfully", {
      requestId,
      tempId,
      email: formData.email,
      docId: docRef.id,
    })

    return NextResponse.json({
      success: true,
      tempId,
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
      message: "Trainer profile created successfully",
    })
  } catch (error) {
    logger.error("Firebase write failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      code: error instanceof Error && "code" in error ? error.code : "unknown",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create trainer profile. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        requestId,
      },
      { status: 500 },
    )
  }
}
