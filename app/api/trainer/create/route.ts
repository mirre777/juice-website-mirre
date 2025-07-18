import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { serverTimestamp } from "firebase-admin/firestore"

export async function POST(request: NextRequest) {
  try {
    console.log("=== TRAINER CREATE API DEBUG ===")

    // Check if database is initialized
    if (!db) {
      console.error("Database not initialized")
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration error",
          details: "Firebase database not initialized",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    console.log("1. Received form data:", {
      fullName: body.fullName,
      email: body.email,
      location: body.location,
      specialty: body.specialty,
    })

    // Validate required fields
    const requiredFields = ["fullName", "email", "location", "specialty", "experience", "bio"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: `Missing: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Generate unique temp ID
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionToken = Math.random().toString(36).substr(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    console.log("2. Generated temp ID:", tempId)

    // Create trainer document with new nested structure
    const trainerDoc = {
      id: tempId,
      tempId,
      status: "temp",
      sessionToken,
      expiresAt: expiresAt.toISOString(),

      // Root level fields (for backward compatibility)
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || "",
      location: body.location,
      specialty: body.specialty,
      experience: body.experience,
      bio: body.bio,
      certifications: body.certifications || "",
      services: body.services || [],

      // New nested content structure
      content: {
        about: {
          title: `About ${body.fullName}`,
          content: body.bio,
          specialty: body.specialty,
        },
        contact: {
          title: "Let's Start Your Fitness Journey",
          description:
            "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
          email: body.email,
          phone: body.phone || "",
          location: body.location,
          fullName: body.fullName,
        },
        customization: {
          isDraft: false,
          lastUpdated: serverTimestamp(),
          version: 1,
        },
      },

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    console.log("3. Creating document in Firestore...")

    // Save to Firestore
    await db.collection("trainers").doc(tempId).set(trainerDoc)

    console.log("4. Document created successfully")

    // Generate preview URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const previewUrl = `${baseUrl}/marketplace/trainer/temp/${tempId}?token=${sessionToken}`

    console.log("5. Generated preview URL:", previewUrl)

    return NextResponse.json({
      success: true,
      tempId,
      previewUrl,
      expiresAt: expiresAt.toISOString(),
      message: "Trainer profile created successfully",
    })
  } catch (error) {
    console.error("Error creating trainer:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create trainer profile. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId: Math.random().toString(36).substr(2, 9),
      },
      { status: 500 },
    )
  }
}
