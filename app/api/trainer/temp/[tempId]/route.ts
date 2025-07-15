import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { logger } from "@/lib/logger"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    logger.info("Initializing Firebase Admin", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    })

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })

    logger.info("Firebase Admin initialized successfully")
  } catch (error) {
    logger.error("Firebase Admin initialization error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
} else {
  logger.info("Firebase Admin already initialized")
}

const db = getFirestore()

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    tempId = params.tempId
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    logger.info("Temp trainer API request started", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      url: request.url,
      method: request.method,
    })

    // Validate required parameters
    if (!tempId) {
      logger.error("Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      logger.error("Missing token parameter", { tempId, searchParams: Object.fromEntries(searchParams) })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Check Firebase connection
    if (!db) {
      logger.error("Firebase not initialized", { tempId })
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    logger.info("Attempting to fetch temp trainer document", {
      tempId,
      collection: "tempTrainers",
    })

    // Get the temp trainer document
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    logger.info("Firestore query completed", {
      tempId,
      exists: tempTrainerDoc.exists,
      docId: tempTrainerDoc.id,
    })

    if (!tempTrainerDoc.exists) {
      logger.error("Temp trainer document not found", {
        tempId,
        collection: "tempTrainers",
        searchedPath: `tempTrainers/${tempId}`,
      })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    logger.info("Temp trainer document data retrieved", {
      tempId,
      hasData: !!tempTrainerData,
      dataKeys: tempTrainerData ? Object.keys(tempTrainerData) : [],
      hasToken: !!tempTrainerData?.token,
      hasCreatedAt: !!tempTrainerData?.createdAt,
      name: tempTrainerData?.name,
    })

    // Verify the token
    if (!tempTrainerData?.token) {
      logger.error("No token found in temp trainer document", {
        tempId,
        documentData: tempTrainerData ? Object.keys(tempTrainerData) : null,
      })
      return NextResponse.json({ error: "Invalid trainer session" }, { status: 403 })
    }

    if (tempTrainerData.token !== token) {
      logger.error("Token mismatch", {
        tempId,
        providedToken: token,
        expectedTokenLength: tempTrainerData.token?.length,
        tokensMatch: tempTrainerData.token === token,
      })
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Check if the temp trainer has expired (24 hours)
    const createdAt = tempTrainerData?.createdAt?.toDate()
    const now = new Date()

    if (!createdAt) {
      logger.error("No createdAt timestamp found", {
        tempId,
        createdAtRaw: tempTrainerData?.createdAt,
        createdAtType: typeof tempTrainerData?.createdAt,
      })
      return NextResponse.json({ error: "Invalid trainer session" }, { status: 410 })
    }

    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    logger.info("Checking expiration", {
      tempId,
      createdAt: createdAt.toISOString(),
      now: now.toISOString(),
      hoursDiff,
      isExpired: hoursDiff > 24,
    })

    if (hoursDiff > 24) {
      logger.error("Temp trainer expired", {
        tempId,
        hoursDiff,
        createdAt: createdAt.toISOString(),
        expirationThreshold: 24,
      })
      return NextResponse.json({ error: "Trainer preview has expired" }, { status: 410 })
    }

    // Prepare response data
    const responseData = {
      id: tempId,
      name: tempTrainerData?.name || "Unknown Trainer",
      email: tempTrainerData?.email || "",
      specialization: tempTrainerData?.specialization || "Personal Trainer",
      bio: tempTrainerData?.bio || "",
      experience: tempTrainerData?.experience || "",
      certifications: tempTrainerData?.certifications || [],
      services: tempTrainerData?.services || [],
      pricing: tempTrainerData?.pricing || {},
      availability: tempTrainerData?.availability || {},
      location: tempTrainerData?.location || "",
      phone: tempTrainerData?.phone || "",
      website: tempTrainerData?.website || "",
      socialMedia: tempTrainerData?.socialMedia || {},
      images: tempTrainerData?.images || [],
      testimonials: tempTrainerData?.testimonials || [],
      content: tempTrainerData?.content || null,
      isActive: false, // Temp trainers are never active
      isPaid: tempTrainerData?.isPaid || false,
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      token: tempTrainerData?.token,
    }

    const duration = Date.now() - startTime

    logger.info("Temp trainer data retrieved successfully", {
      tempId,
      name: responseData.name,
      duration,
      responseDataKeys: Object.keys(responseData),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    const duration = Date.now() - startTime

    logger.error("Temp trainer API error", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      duration,
      url: request.url,
    })

    // Log additional context for common error types
    if (error instanceof Error) {
      if (error.message.includes("Firebase")) {
        logger.error("Firebase-specific error details", {
          tempId,
          firebaseAppsLength: getApps().length,
          hasFirestoreDb: !!db,
          errorMessage: error.message,
        })
      }

      if (error.message.includes("permission") || error.message.includes("auth")) {
        logger.error("Authentication/permission error", {
          tempId,
          hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
          hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        })
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        tempId: tempId || "unknown",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    tempId = params.tempId
    const body = await request.json()
    const { token, ...updateData } = body

    logger.info("Temp trainer PUT request started", {
      tempId,
      hasToken: !!token,
      updateDataKeys: Object.keys(updateData),
    })

    if (!tempId) {
      logger.error("PUT: Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      logger.error("PUT: Missing token parameter", { tempId })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get the temp trainer document
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    if (!tempTrainerDoc.exists) {
      logger.error("PUT: Temp trainer not found", { tempId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    // Verify the token
    if (tempTrainerData?.token !== token) {
      logger.error("PUT: Token mismatch", {
        tempId,
        providedToken: token,
        hasExpectedToken: !!tempTrainerData?.token,
      })
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Update the temp trainer
    await tempTrainerRef.update({
      ...updateData,
      updatedAt: new Date(),
    })

    const duration = Date.now() - startTime

    logger.info("Temp trainer updated successfully", {
      tempId,
      duration,
      updatedFields: Object.keys(updateData),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const duration = Date.now() - startTime

    logger.error("Temp trainer PUT error", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
