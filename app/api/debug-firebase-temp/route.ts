import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../firebase"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    logger.info("Debug Firebase endpoint called")

    // Check if Firebase is initialized
    if (!db) {
      logger.error("Firebase not initialized")
      return NextResponse.json(
        {
          success: false,
          error: "Firebase database not initialized",
          details: "The Firebase configuration may be missing or incorrect",
        },
        { status: 500 },
      )
    }

    // Test Firebase connection by querying trainers collection
    logger.info("Testing Firebase connection")
    const trainersRef = collection(db, "trainers")
    const q = query(trainersRef, limit(1))
    const querySnapshot = await getDocs(q)

    logger.info("Firebase query completed", {
      docsCount: querySnapshot.size,
      empty: querySnapshot.empty,
    })

    // Check environment variables
    const envVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    logger.info("Environment variables check", envVars)

    return NextResponse.json({
      success: true,
      message: "Firebase connection successful",
      data: {
        trainersCollectionExists: true,
        trainersCount: querySnapshot.size,
        environmentVariables: envVars,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error("Debug Firebase endpoint error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Firebase connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        environmentVariables: {
          NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        },
      },
      { status: 500 },
    )
  }
}
