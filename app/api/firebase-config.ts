import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"
import { logger } from "@/lib/logger"

let db: FirebaseFirestore.Firestore | null = null

export function hasRealFirebaseConfig(): boolean {
  const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

  const hasAllVars = requiredEnvVars.every((varName) => {
    const value = process.env[varName]
    return value && value.trim() !== ""
  })

  logger.debug("Firebase config check", {
    hasAllVars,
    projectId: process.env.FIREBASE_PROJECT_ID ? "present" : "missing",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "present" : "missing",
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? "present" : "missing",
  })

  return hasAllVars
}

function initializeFirebase() {
  try {
    if (!hasRealFirebaseConfig()) {
      logger.warn("Firebase configuration incomplete - using mock mode")
      return null
    }

    // Check if Firebase is already initialized
    if (getApps().length > 0) {
      logger.info("Firebase already initialized")
      return getFirestore()
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!privateKey) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing or invalid")
    }

    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID!,
    })

    const firestore = getFirestore(app)
    logger.info("Firebase initialized successfully", {
      projectId: process.env.FIREBASE_PROJECT_ID,
    })

    return firestore
  } catch (error) {
    logger.error("Failed to initialize Firebase", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}

// Initialize Firebase
db = initializeFirebase()

export { db }
