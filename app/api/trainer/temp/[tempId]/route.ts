import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    console.log("🔥 Initializing Firebase Admin", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
    })

    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }

    console.log("🔧 Firebase config prepared", {
      hasProjectId: !!firebaseConfig.projectId,
      hasClientEmail: !!firebaseConfig.clientEmail,
      hasPrivateKey: !!firebaseConfig.privateKey,
      projectId: firebaseConfig.projectId,
    })

    initializeApp({
      credential: cert(firebaseConfig),
    })

    console.log("✅ Firebase Admin initialized successfully")
  } catch (error) {
    console.error("❌ Firebase Admin initialization error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
    })
    throw error
  }
} else {
  console.log("♻️ Firebase Admin already initialized")
}

let db: FirebaseFirestore.Firestore

try {
  db = getFirestore()
  console.log("📊 Firestore instance created successfully")
} catch (error) {
  console.error("❌ Failed to get Firestore instance", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  })
  throw error
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
      console.error("❌ Missing tempId parameter", { params })
      return NextResponse.json({ error: "Temp ID is required" }, { status: 400 })
    }

    if (!token) {
      console.error("❌ Missing token parameter", {
        tempId,
        searchParams: Object.fromEntries(searchParams),
        allHeaders: Object.fromEntries(request.headers.entries()),
      })
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Check Firebase connection
    if (!db) {
      console.error("❌ Firebase not initialized", { tempId })
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    console.log("🔍 Attempting to fetch temp trainer document", {
      tempId,
      collection: "tempTrainers",
      fullPath: `tempTrainers/${tempId}`,
    })

    // Get the temp trainer document with detailed error handling
    let tempTrainerRef: FirebaseFirestore.DocumentReference
    let tempTrainerDoc: FirebaseFirestore.DocumentSnapshot

    try {
      tempTrainerRef = db.collection("tempTrainers").doc(tempId)
      console.log("📄 Document reference created", {
        tempId,
        refPath: tempTrainerRef.path,
      })

      tempTrainerDoc = await tempTrainerRef.get()
      console.log("📥 Firestore query completed", {
        tempId,
        exists: tempTrainerDoc.exists,
        docId: tempTrainerDoc.id,
        readTime: tempTrainerDoc.readTime,
        createTime: tempTrainerDoc.createTime,
        updateTime: tempTrainerDoc.updateTime,
      })
    } catch (firestoreError) {
      console.error("❌ Firestore query failed", {
        tempId,
        error: firestoreError instanceof Error ? firestoreError.message : String(firestoreError),
        stack: firestoreError instanceof Error ? firestoreError.stack : undefined,
        errorCode: (firestoreError as any)?.code,
        errorDetails: (firestoreError as any)?.details,
      })
      throw firestoreError
    }

    if (!tempTrainerDoc.exists) {
      console.error("❌ Temp trainer document not found", {
        tempId,
        collection: "tempTrainers",
        searchedPath: `tempTrainers/${tempId}`,
        docExists: tempTrainerDoc.exists,
      })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    let tempTrainerData: FirebaseFirestore.DocumentData | undefined

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
        createdAtType: typeof tempTrainerData?.createdAt,
      })
    } catch (dataError) {
      console.error("❌ Failed to extract document data", {
        tempId,
        error: dataError instanceof Error ? dataError.message : String(dataError),
        stack: dataError instanceof Error ? dataError.stack : undefined,
      })
      throw dataError
    }

    // Verify the token
    if (!tempTrainerData?.token) {
      console.error("❌ No token found in temp trainer document", {
        tempId,
        documentData: tempTrainerData ? Object.keys(tempTrainerData) : null,
        hasTokenField: tempTrainerData && "token" in tempTrainerData,
        tokenValue: tempTrainerData?.token,
      })
      return NextResponse.json({ error: "Invalid trainer session" }, { status: 403 })
    }

    if (tempTrainerData.token !== token) {
      console.error("❌ Token mismatch", {
        tempId,
        providedToken: token?.substring(0, 10) + "...",
        expectedTokenLength: tempTrainerData.token?.length,
        providedTokenLength: token?.length,
        tokensMatch: tempTrainerData.token === token,
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
        createdAtType: typeof tempTrainerData?.createdAt,
        hasToDate: !!tempTrainerData?.createdAt?.toDate,
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
      expirationThreshold: 24,
    })

    if (hoursDiff > 24) {
      console.error("⏰ Temp trainer expired", {
        tempId,
        hoursDiff: Math.round(hoursDiff * 100) / 100,
        createdAt: createdAt.toISOString(),
        expirationThreshold: 24,
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
      responseDataKeys: Object.keys(responseData),
      trainerKeys: Object.keys(responseData.trainer),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("💥 Temp trainer API error", {
      tempId: tempId || "unknown",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorName: error instanceof Error ? error.name : undefined,
      duration: `${duration}ms`,
      url: request.url,
    })

    // Log additional context for common error types
    if (error instanceof Error) {
      if (error.message.includes("Firebase") || error.message.includes("firestore")) {
        console.error("🔥 Firebase-specific error details", {
          tempId,
          firebaseAppsLength: getApps().length,
          hasFirestoreDb: !!db,
          errorMessage: error.message,
          errorCode: (error as any)?.code,
        })
      }

      if (error.message.includes("permission") || error.message.includes("auth")) {
        console.error("🔐 Authentication/permission error", {
          tempId,
          hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
          hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
          projectId: process.env.FIREBASE_PROJECT_ID,
        })
      }

      if (error.message.includes("network") || error.message.includes("timeout")) {
        console.error("🌐 Network error", {
          tempId,
          errorMessage: error.message,
          userAgent: request.headers.get("user-agent"),
        })
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
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

    tempId = params.tempId
    const body = await request.json()
    const { token, ...updateData } = body

    console.log("📋 PUT request parameters", {
      tempId,
      hasToken: !!token,
      updateDataKeys: Object.keys(updateData),
      bodySize: JSON.stringify(body).length,
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
    const tempTrainerRef = db.collection("tempTrainers").doc(tempId)
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
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
