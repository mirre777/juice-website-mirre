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

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.location ||
      !formData.specialty ||
      !formData.experience ||
      !formData.bio ||
      !formData.services ||
      formData.services.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "Please fill in all required fields",
        },
        { status: 400 },
      )
    }

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

    // Create structured content object
    const content = {
      hero: {
        title: `Transform Your Fitness with ${formData.fullName}`,
        subtitle: `Professional ${formData.specialty} trainer in ${formData.location}`,
        description: formData.bio,
      },
      about: {
        title: `About ${formData.fullName}`,
        content: formData.bio,
      },
      services: formData.services.map((service, index) => ({
        id: String(index + 1),
        title: service,
        description: `Professional ${service.toLowerCase()} sessions tailored to your goals`,
        price: 60,
        duration: "60 minutes",
        featured: index === 0,
      })),
      contact: {
        title: "Let's Start Your Fitness Journey",
        description:
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        email: formData.email,
        phone: formData.phone || "Contact for details",
        location: formData.location,
      },
      seo: {
        title: `${formData.fullName} - Personal Trainer in ${formData.location}`,
        description: `Professional ${formData.specialty} training with ${formData.fullName}. Transform your fitness with personalized programs in ${formData.location}.`,
      },
      customization: {
        lastUpdated: new Date(),
        version: 1,
        isDraft: false,
      },
    }

    // Create temporary trainer document with new schema
    const tempTrainerData = {
      // Basic trainer info
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      specialty: formData.specialty,
      experience: formData.experience,
      certifications: formData.certifications,

      // All content organized under content object
      content: content,

      // Status and metadata
      status: "temp",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
      sessionToken,
      isActive: false,
      isPaid: false,
      requestId,
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    logger.info("Creating trainer document with new schema", {
      requestId,
      email: formData.email,
      expiresAt: expiresAt.toISOString(),
      servicesCount: formData.services?.length || 0,
      hasContent: !!content,
    })

    // Use Firebase Admin SDK syntax
    const trainersCollection = db.collection("trainers")
    const docRef = await trainersCollection.add(tempTrainerData)

    const tempId = docRef.id

    logger.info("Trainer document created successfully with new schema", {
      requestId,
      tempId,
      email: formData.email,
      sessionToken: sessionToken.substring(0, 8) + "...", // Log partial token for security
    })

    // Return the response with tempId and token
    return NextResponse.json({
      success: true,
      tempId: tempId,
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
      message: "Trainer profile created successfully",
      redirectUrl: `/marketplace/trainer/temp/${tempId}?token=${sessionToken}`,
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
