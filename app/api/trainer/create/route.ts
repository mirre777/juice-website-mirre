import { type NextRequest, NextResponse } from "next/server"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, validateFirebaseConnection, hasRealFirebaseConfig } from "../../firebase-config"
import { logger } from "../../../lib/logger"

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7)

  try {
    logger.info("Trainer creation request started", { requestId })

    // Validate Firebase connection first
    const isConnected = await validateFirebaseConnection()
    if (!isConnected) {
      logger.error("Firebase connection validation failed", { requestId })
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check if we have real Firebase config
    if (!hasRealFirebaseConfig()) {
      logger.warn("Using mock Firebase configuration", { requestId })
    }

    // Parse request body
    const body = await request.json()
    logger.info("Request body parsed", { requestId, bodyKeys: Object.keys(body) })

    // Validate required fields
    const requiredFields = ["name", "email", "specialization"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      logger.error("Missing required fields", { requestId, missingFields })
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Validate database instance
    if (!db) {
      logger.error("Database instance not available", { requestId })
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }

    // Prepare trainer data
    const trainerData = {
      name: body.name,
      email: body.email,
      specialization: body.specialization,
      bio: body.bio || "",
      experience: body.experience || "",
      certifications: body.certifications || [],
      services: body.services || [],
      contactInfo: body.contactInfo || {},
      socialMedia: body.socialMedia || {},
      availability: body.availability || {},
      pricing: body.pricing || {},
      location: body.location || "",
      profileImage: body.profileImage || "",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    logger.info("Trainer data prepared", { requestId, trainerName: trainerData.name })

    // Create trainer document in Firestore
    const trainersCollection = collection(db, "trainers")
    const docRef = await addDoc(trainersCollection, trainerData)

    logger.info("Trainer document created successfully", {
      requestId,
      docId: docRef.id,
      trainerName: trainerData.name,
    })

    // Create temporary profile data
    const tempData = {
      trainerId: docRef.id,
      name: trainerData.name,
      specialization: trainerData.specialization,
      bio: trainerData.bio,
      status: "active",
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }

    const tempCollection = collection(db, "temp-trainers")
    const tempDocRef = await addDoc(tempCollection, tempData)

    logger.info("Temporary trainer profile created", {
      requestId,
      tempId: tempDocRef.id,
      trainerId: docRef.id,
    })

    // Return success response
    const response = {
      success: true,
      trainerId: docRef.id,
      tempId: tempDocRef.id,
      message: "Trainer profile created successfully",
      tempUrl: `/marketplace/trainer/temp/${tempDocRef.id}`,
    }

    logger.info("Trainer creation completed successfully", { requestId, response })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    logger.error("Trainer creation API error", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create trainer profile",
        requestId,
      },
      { status: 500 },
    )
  }
}
