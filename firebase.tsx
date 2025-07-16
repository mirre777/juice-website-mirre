import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { logger } from "@/lib/logger"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase app (singleton pattern)
function initializeFirebaseApp() {
  try {
    // Check if app already exists
    if (getApps().length > 0) {
      logger.debug("Firebase app already initialized")
      return getApp()
    }

    logger.info("Initializing Firebase app", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    })

    const app = initializeApp(firebaseConfig)
    logger.info("Firebase app initialized successfully")
    return app
  } catch (error) {
    logger.error("Failed to initialize Firebase app", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

// Initialize Firestore (client-side only)
export const db = getFirestore(initializeFirebaseApp())

// Initialize Auth (client-side only)
export const auth = getAuth(initializeFirebaseApp())

// Helper function to check if Firestore is available
export function isFirestoreAvailable() {
  try {
    return !!(firebaseConfig.projectId && firebaseConfig.apiKey)
  } catch (error) {
    console.error("Firestore availability check failed:", error)
    return false
  }
}

// Export configuration for debugging (client-side safe)
export function getFirebaseConfig() {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId,
    hasApp: getApps().length > 0,
    hasDb: !!db,
  }
}

// Export initialization function
export function initializeFirebase() {
  return initializeFirebaseApp()
}
