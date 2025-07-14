import { NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.info("Debug Firebase connection test started")

    // Test basic Firebase connection
    if (!db) {
      return NextResponse.json({
        success: false,
        error: "Firebase not initialized",
        timestamp: new Date().toISOString(),
      })
    }

    // Test Firestore query
    const trainersRef = collection(db, "trainers")
    const q = query(trainersRef, limit(1))
    const querySnapshot = await getDocs(q)

    const testResults = {
      success: true,
      firebase: {
        initialized: !!db,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      },
      firestore: {
        connected: true,
        trainersCollection: {
          exists: true,
          documentCount: querySnapshot.size,
          sampleDocument: querySnapshot.empty ? null : querySnapshot.docs[0].id,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        timestamp: new Date().toISOString(),
      },
    }

    logger.info("Firebase debug test completed successfully", testResults)
    return NextResponse.json(testResults)
  } catch (error) {
    const errorInfo = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      firebase: {
        initialized: !!db,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      },
      timestamp: new Date().toISOString(),
    }

    logger.error("Firebase debug test failed", errorInfo)
    return NextResponse.json(errorInfo, { status: 500 })
  }
}
