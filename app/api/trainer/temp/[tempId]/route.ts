import { type NextRequest, NextResponse } from "next/server"

// Global error handler to ensure all responses are JSON
function createErrorResponse(error: any, tempId?: string, status = 500) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorDetails = error instanceof Error ? error.stack : undefined

  console.error("🚨 Creating error response", {
    error: errorMessage,
    stack: errorDetails,
    tempId: tempId || "unknown",
    status,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(
    {
      error: "Internal server error",
      details: errorMessage,
      tempId: tempId || "unknown",
      timestamp: new Date().toISOString(),
      success: false,
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

// Firebase initialization with better error handling
let firebaseApp: any = null
let firestoreDb: any = null
let initializationPromise: Promise<any> | null = null

async function getFirebaseDb() {
  // Return cached instance if available
  if (firestoreDb) {
    console.log("♻️ Using cached Firestore instance")
    return firestoreDb
  }

  // Wait for ongoing initialization if in progress
  if (initializationPromise) {
    console.log("⏳ Waiting for ongoing Firebase initialization")
    return await initializationPromise
  }

  // Start new initialization
  initializationPromise = initializeFirebase()
  return await initializationPromise
}

async function initializeFirebase() {
  try {
    console.log("🔥 Starting Firebase initialization")

    // Validate environment variables first
    const requiredEnvVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    }

    console.log("🔍 Checking environment variables", {
      hasProjectId: !!requiredEnvVars.FIREBASE_PROJECT_ID,
      hasClientEmail: !!requiredEnvVars.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!requiredEnvVars.FIREBASE_PRIVATE_KEY,
      projectId: requiredEnvVars.FIREBASE_PROJECT_ID,
    })

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
      }
    }

    // Import Firebase modules
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    console.log("📦 Firebase modules imported successfully")

    // Initialize app if not already done
    if (!getApps().length) {
      console.log("🚀 Initializing new Firebase app")

      const firebaseConfig = {
        projectId: requiredEnvVars.FIREBASE_PROJECT_ID,
        clientEmail: requiredEnvVars.FIREBASE_CLIENT_EMAIL,
        privateKey: requiredEnvVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }

      firebaseApp = initializeApp({
        credential: cert(firebaseConfig),
      })

      console.log("✅ Firebase app initialized successfully")
    } else {
      console.log("♻️ Using existing Firebase app")
      firebaseApp = getApps()[0]
    }

    // Get Firestore instance
    firestoreDb = getFirestore(firebaseApp)
    console.log("📊 Firestore instance created successfully")

    return firestoreDb
  } catch (error) {
    console.error("❌ Firebase initialization failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Reset initialization state on failure
    initializationPromise = null
    firestoreDb = null
    firebaseApp = null

    throw error
  }
}

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    console.log("🚀 Starting temp trainer API request")

    tempId = params.tempId
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("📋 Request parameters", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      url: request.url,
      method: request.method,
      userAgent: request.headers.get("user-agent"),
    })

    // Validate required parameters
    if (!tempId) {
      console.error("❌ Missing tempId parameter")
      return NextResponse.json(
        { error: "Temp ID is required", success: false },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    if (!token) {
      console.error("❌ Missing token parameter")
      return NextResponse.json(
        { error: "Token is required", success: false },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Initialize Firebase with error handling
    let db: any
    try {
      console.log("🔄 Getting Firebase database instance")
      db = await getFirebaseDb()
      console.log("✅ Firebase database ready")
    } catch (firebaseError) {
      console.error("❌ Firebase initialization failed", {
        error: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
        stack: firebaseError instanceof Error ? firebaseError.stack : undefined,
      })
      return createErrorResponse(firebaseError, tempId, 500)
    }

    // Query Firestore
    console.log("🔍 Querying temp trainer document", {
      tempId,
      collection: "tempTrainers",
    })

    let tempTrainerDoc: any
    try {
      const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
      tempTrainerDoc = await tempTrainerRef.get()

      console.log("📥 Firestore query completed", {
        tempId,
        exists: tempTrainerDoc.exists,
        docId: tempTrainerDoc.id,
      })
    } catch (queryError) {
      console.error("❌ Firestore query failed", {
        error: queryError instanceof Error ? queryError.message : String(queryError),
        stack: queryError instanceof Error ? queryError.stack : undefined,
        tempId,
      })
      return createErrorResponse(queryError, tempId, 500)
    }

    if (!tempTrainerDoc.exists) {
      console.error("❌ Temp trainer document not found", { tempId })
      return NextResponse.json(
        { error: "Trainer not found", success: false },
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    // Extract document data
    let tempTrainerData: any
    try {
      tempTrainerData = tempTrainerDoc.data()
      console.log("📊 Document data extracted", {
        tempId,
        hasData: !!tempTrainerData,
        dataKeys: tempTrainerData ? Object.keys(tempTrainerData) : [],
        hasToken: !!tempTrainerData?.token,
        hasCreatedAt: !!tempTrainerData?.createdAt,
        name: tempTrainerData?.name,
      })
    } catch (dataError) {
      console.error("❌ Failed to extract document data", {
        error: dataError instanceof Error ? dataError.message : String(dataError),
        tempId,
      })
      return createErrorResponse(dataError, tempId, 500)
    }

    // Verify token
    if (!tempTrainerData?.token) {
      console.error("❌ No token in document", { tempId })
      return NextResponse.json(
        { error: "Invalid trainer session", success: false },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    if (tempTrainerData.token !== token) {
      console.error("❌ Token mismatch", {
        tempId,
        providedLength: token?.length,
        expectedLength: tempTrainerData.token?.length,
      })
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("✅ Token verified successfully", { tempId })

    // Check expiration
    let createdAt: Date
    try {
      if (tempTrainerData?.createdAt?.toDate) {
        createdAt = tempTrainerData.createdAt.toDate()
      } else if (tempTrainerData?.createdAt instanceof Date) {
        createdAt = tempTrainerData.createdAt
      } else if (typeof tempTrainerData?.createdAt === "string") {
        createdAt = new Date(tempTrainerData.createdAt)
      } else {
        throw new Error("Invalid createdAt format")
      }

      const now = new Date()
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

      console.log("⏰ Expiration check", {
        tempId,
        createdAt: createdAt.toISOString(),
        hoursDiff: Math.round(hoursDiff * 100) / 100,
        isExpired: hoursDiff > 24,
      })

      if (hoursDiff > 24) {
        console.error("⏰ Temp trainer expired", { tempId, hoursDiff })
        return NextResponse.json(
          { error: "Trainer preview has expired", success: false },
          { status: 410, headers: { "Content-Type": "application/json" } },
        )
      }
    } catch (dateError) {
      console.error("❌ Date parsing failed", {
        error: dateError instanceof Error ? dateError.message : String(dateError),
        tempId,
        createdAtRaw: tempTrainerData?.createdAt,
      })
      return NextResponse.json(
        { error: "Invalid trainer session", success: false },
        { status: 410, headers: { "Content-Type": "application/json" } },
      )
    }

    // Prepare successful response
    const responseData = {
      success: true,
      trainer: {
        id: tempId,
        name: tempTrainerData?.name || "Unknown Trainer",
        fullName: tempTrainerData?.fullName || tempTrainerData?.name || "Unknown Trainer",
        email: tempTrainerData?.email || "",
        specialization: tempTrainerData?.specialization || "Personal Trainer",
        bio:
          tempTrainerData?.bio ||
          "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
        experience: tempTrainerData?.experience || "5+ years experience",
        certifications: Array.isArray(tempTrainerData?.certifications)
          ? tempTrainerData.certifications
          : tempTrainerData?.certifications
            ? [tempTrainerData.certifications]
            : ["Certified Personal Trainer"],
        services: Array.isArray(tempTrainerData?.services)
          ? tempTrainerData.services
          : ["Personal Training", "Fitness Consultation"],
        pricing: tempTrainerData?.pricing || { session: 60 },
        availability: tempTrainerData?.availability || {},
        location: tempTrainerData?.location || "Location Available",
        phone: tempTrainerData?.phone || "",
        website: tempTrainerData?.website || "",
        socialMedia: tempTrainerData?.socialMedia || {},
        images: Array.isArray(tempTrainerData?.images) ? tempTrainerData.images : [],
        testimonials: Array.isArray(tempTrainerData?.testimonials) ? tempTrainerData.testimonials : [],
        content: tempTrainerData?.content || null,
        isActive: false,
        isPaid: tempTrainerData?.isPaid || false,
        createdAt: createdAt.toISOString(),
        expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        token: tempTrainerData?.token,
      },
    }

    const duration = Date.now() - startTime
    console.log("✅ Request completed successfully", {
      tempId,
      name: responseData.trainer.name,
      duration: `${duration}ms`,
    })

    return NextResponse.json(responseData, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("💥 Unhandled error in GET handler", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    return createErrorResponse(error, tempId, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    console.log("🚀 Starting temp trainer PUT request")

    tempId = params.tempId
    const body = await request.json()
    const { token, ...updateData } = body

    console.log("📋 PUT request parameters", {
      tempId,
      hasToken: !!token,
      updateDataKeys: Object.keys(updateData),
    })

    if (!tempId) {
      return NextResponse.json(
        { error: "Temp ID is required", success: false },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: "Token is required", success: false },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Get Firebase database
    let db: any
    try {
      db = await getFirebaseDb()
    } catch (firebaseError) {
      return createErrorResponse(firebaseError, tempId, 500)
    }

    // Get and verify document
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    if (!tempTrainerDoc.exists) {
      return NextResponse.json(
        { error: "Trainer not found", success: false },
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    const tempTrainerData = tempTrainerDoc.data()

    if (tempTrainerData?.token !== token) {
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    // Update document
    await tempTrainerRef.update({
      ...updateData,
      updatedAt: new Date(),
    })

    const duration = Date.now() - startTime
    console.log("✅ PUT request completed successfully", {
      tempId,
      duration: `${duration}ms`,
    })

    return NextResponse.json({ success: true }, { headers: { "Content-Type": "application/json" } })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("💥 Unhandled error in PUT handler", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    return createErrorResponse(error, tempId, 500)
  }
}
