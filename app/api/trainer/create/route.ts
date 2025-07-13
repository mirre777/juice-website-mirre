import { type NextRequest, NextResponse } from "next/server"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, validateFirebaseConnection, hasRealFirebaseConfig } from "../../firebase-config"

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7)

  try {
    console.log("Trainer creation request started", { requestId })

    // Parse request body first
    const body = await request.json()
    console.log("Request body parsed", { requestId, bodyKeys: Object.keys(body) })

    // Validate required fields
    const requiredFields = ["fullName", "email", "specialty", "location"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.error("Missing required fields", { requestId, missingFields })
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Check if we have real Firebase config
    if (!hasRealFirebaseConfig()) {
      console.log("Using mock Firebase configuration - simulating success", { requestId })

      // Simulate successful creation for mock mode
      const mockResponse = {
        success: true,
        trainerId: `mock_${requestId}`,
        tempId: `temp_${requestId}`,
        message: "Trainer profile created successfully (mock mode)",
        tempUrl: `/marketplace/trainer/temp/mock_${requestId}`,
      }

      return NextResponse.json(mockResponse, { status: 201 })
    }

    // Validate Firebase connection
    const isConnected = await validateFirebaseConnection()
    if (!isConnected || !db) {
      console.error("Firebase connection validation failed", { requestId })
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Prepare trainer data
    const trainerData = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || "",
      location: body.location,
      specialty: body.specialty,
      experience: body.experience || "",
      bio: body.bio || "",
      certifications: body.certifications || "",
      services: Array.isArray(body.services) ? body.services : [],
      pricing: body.pricing || "",
      availability: body.availability || "",
      socialMedia: body.socialMedia || {},
      profileImage: body.profileImage || "",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    console.log("Trainer data prepared", { requestId, trainerName: trainerData.fullName })

    // Create trainer document in Firestore
    const trainersCollection = collection(db, "trainers")
    const docRef = await addDoc(trainersCollection, trainerData)

    console.log("Trainer document created successfully", {
      requestId,
      docId: docRef.id,
      trainerName: trainerData.fullName,
    })

    // Create temporary profile data
    const tempData = {
      trainerId: docRef.id,
      fullName: trainerData.fullName,
      specialty: trainerData.specialty,
      bio: trainerData.bio,
      status: "active",
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }

    const tempCollection = collection(db, "temp-trainers")
    const tempDocRef = await addDoc(tempCollection, tempData)

    console.log("Temporary trainer profile created", {
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

    console.log("Trainer creation completed successfully", { requestId, response })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Trainer creation API error", {
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
