import { type NextRequest, NextResponse } from "next/server"

// Import Firebase modules at the top level to avoid dynamic import issues
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin once at module level
let db: any = null
let firebaseInitialized = false

async function initializeFirebaseIfNeeded() {
  if (firebaseInitialized && db) {
    return db
  }

  try {
    console.log("🔥 Initializing Firebase Admin", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
      existingApps: getApps().length,
    })

    // Validate environment variables
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error("FIREBASE_PROJECT_ID environment variable is missing")
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error("FIREBASE_CLIENT_EMAIL environment variable is missing")
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("FIREBASE_PRIVATE_KEY environment variable is missing")
    }

    // Only initialize if no apps exist
    if (!getApps().length) {
      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }

      console.log("🔧 Firebase config prepared", {
        projectId: firebaseConfig.projectId,
        clientEmailDomain: firebaseConfig.clientEmail?.split("@")[1],
        privateKeyStart: firebaseConfig.privateKey?.substring(0, 50) + "...",
      })

      initializeApp({
        credential: cert(firebaseConfig),
      })

      console.log("✅ Firebase Admin initialized successfully")
    } else {
      console.log("♻️ Firebase Admin already initialized")
    }

    // Get Firestore instance
    db = getFirestore()
    firebaseInitialized = true

    console.log("📊 Firestore instance created successfully")
    return db
  } catch (error) {
    console.error("❌ Firebase initialization error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
    })
    throw error
  }
}

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    console.log("🚀 Starting temp trainer API request")

    // Initialize Firebase
    let database: any
    try {
      database = await initializeFirebaseIfNeeded()
    } catch (firebaseError) {
      console.error("❌ Firebase initialization failed", {
        error: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
        stack: firebaseError instanceof Error ? firebaseError.stack : undefined,
      })
      return NextResponse.json(
        {
          error: "Firebase initialization failed",
          details: firebaseError instanceof Error ? firebaseError.message : "Unknown Firebase error",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    tempId = params.tempId
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("📋 Request parameters", {
      tempId,
      hasToken: !!token,
      tokenLength: token?.length,
      url: request.url,
      method: request.method,
    })

    // Validate required parameters
    if (!tempId) {
      console.error("❌ Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ Missing token parameter", {
        tempId,
        searchParams: Object.fromEntries(searchParams),
      })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    console.log("🔍 Attempting to fetch temp trainer document", {
      tempId,
      collection: "tempTrainers",
      fullPath: `tempTrainers/${tempId}`,
    })

    // Get the temp trainer document with detailed error handling
    let tempTrainerRef: any
    let tempTrainerDoc: any

    try {
      tempTrainerRef = database.collection("tempTrainers").doc(tempId)
      console.log("📄 Document reference created", {
        tempId,
        refPath: tempTrainerRef.path,
      })

      tempTrainerDoc = await tempTrainerRef.get()
      console.log("📥 Firestore query completed", {
        tempId,
        exists: tempTrainerDoc.exists,
        docId: tempTrainerDoc.id,
      })
    } catch (firestoreError) {
      console.error("❌ Firestore query failed", {
        tempId,
        error: firestoreError instanceof Error ? firestoreError.message : String(firestoreError),
        stack: firestoreError instanceof Error ? firestoreError.stack : undefined,
        errorCode: (firestoreError as any)?.code,
      })
      return NextResponse.json(
        {
          error: "Database query failed",
          details: firestoreError instanceof Error ? firestoreError.message : "Unknown database error",
          tempId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    if (!tempTrainerDoc.exists) {
      console.error("❌ Temp trainer document not found", {
        tempId,
        collection: "tempTrainers",
        searchedPath: `tempTrainers/${tempId}`,
      })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    let tempTrainerData: any

    try {
      tempTrainerData = tempTrainerDoc.data()
      console.log("📊 Temp trainer document data retrieved", {
        tempId,
        hasData: !!tempTrainerData,
        dataKeys: tempTrainerData ? Object.keys(tempTrainerData) : [],
        hasToken: !!tempTrainerData?.token,
        hasCreatedAt: !!tempTrainerData?.createdAt,
        name: tempTrainerData?.name,
        email: tempTrainerData?.email,
      })
    } catch (dataError) {
      console.error("❌ Failed to extract document data", {
        tempId,
        error: dataError instanceof Error ? dataError.message : String(dataError),
        stack: dataError instanceof Error ? dataError.stack : undefined,
      })
      return NextResponse.json(
        {
          error: "Failed to read trainer data",
          details: dataError instanceof Error ? dataError.message : "Unknown data error",
          tempId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Verify the token
    if (!tempTrainerData?.token) {
      console.error("❌ No token found in temp trainer document", {
        tempId,
        documentData: tempTrainerData ? Object.keys(tempTrainerData) : null,
      })
      return NextResponse.json({ error: "Invalid trainer session" }, { status: 403 })
    }

    if (tempTrainerData.token !== token) {
      console.error("❌ Token mismatch", {
        tempId,
        providedToken: token?.substring(0, 10) + "...",
        expectedTokenLength: tempTrainerData.token?.length,
        providedTokenLength: token?.length,
      })
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    console.log("✅ Token verified successfully", { tempId })

    // Check if the temp trainer has expired (24 hours)
    let createdAt: Date
    const now = new Date()

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

      console.log("📅 Date parsing successful", {
        tempId,
        createdAt: createdAt.toISOString(),
      })
    } catch (dateError) {
      console.error("❌ Date parsing failed", {
        tempId,
        createdAtRaw: tempTrainerData?.createdAt,
        createdAtType: typeof tempTrainerData?.createdAt,
        error: dateError instanceof Error ? dateError.message : String(dateError),
      })
      return NextResponse.json({ error: "Invalid trainer session" }, { status: 410 })
    }

    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    console.log("⏰ Checking expiration", {
      tempId,
      createdAt: createdAt.toISOString(),
      now: now.toISOString(),
      hoursDiff: Math.round(hoursDiff * 100) / 100,
      isExpired: hoursDiff > 24,
    })

    if (hoursDiff > 24) {
      console.error("⏰ Temp trainer expired", {
        tempId,
        hoursDiff: Math.round(hoursDiff * 100) / 100,
        createdAt: createdAt.toISOString(),
      })
      return NextResponse.json({ error: "Trainer preview has expired" }, { status: 410 })
    }

    // Prepare response data with safe defaults
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
        isActive: false, // Temp trainers are never active
        isPaid: tempTrainerData?.isPaid || false,
        createdAt: createdAt.toISOString(),
        expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        token: tempTrainerData?.token,
      },
    }

    const duration = Date.now() - startTime

    console.log("✅ Temp trainer data retrieved successfully", {
      tempId,
      name: responseData.trainer.name,
      email: responseData.trainer.email,
      duration: `${duration}ms`,
    })

    return NextResponse.json(responseData)
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("💥 Temp trainer API error", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      duration: `${duration}ms`,
      url: request.url,
    })

    // Always return JSON, never plain text
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        tempId: tempId || "unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  const startTime = Date.now()
  let tempId: string | undefined

  try {
    console.log("🚀 Starting temp trainer PUT request")

    // Initialize Firebase
    let database: any
    try {
      database = await initializeFirebaseIfNeeded()
    } catch (firebaseError) {
      console.error("❌ PUT: Firebase initialization failed", {
        error: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
      })
      return NextResponse.json(
        {
          error: "Firebase initialization failed",
          details: firebaseError instanceof Error ? firebaseError.message : "Unknown Firebase error",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    tempId = params.tempId
    const body = await request.json()
    const { token, ...updateData } = body

    console.log("📋 PUT request parameters", {
      tempId,
      hasToken: !!token,
      updateDataKeys: Object.keys(updateData),
    })

    if (!tempId) {
      console.error("❌ PUT: Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ PUT: Missing token parameter", { tempId })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get the temp trainer document
    const tempTrainerRef = database.collection("tempTrainers").doc(tempId)
    const tempTrainerDoc = await tempTrainerRef.get()

    console.log("📥 PUT: Document retrieved", {
      tempId,
      exists: tempTrainerDoc.exists,
    })

    if (!tempTrainerDoc.exists) {
      console.error("❌ PUT: Temp trainer not found", { tempId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    // Verify the token
    if (tempTrainerData?.token !== token) {
      console.error("❌ PUT: Token mismatch", {
        tempId,
        providedToken: token?.substring(0, 10) + "...",
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

    console.log("✅ PUT: Temp trainer updated successfully", {
      tempId,
      duration: `${duration}ms`,
      updatedFields: Object.keys(updateData),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("💥 PUT: Temp trainer error", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
