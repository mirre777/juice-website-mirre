import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Ensure all required environment variables are strings
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin: Missing required environment variables")
      return null
    }

    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    })

    console.log("Firebase Admin initialized successfully")
    return app
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return null
  }
}

// Initialize Firebase Admin
const firebaseApp = initializeFirebaseAdmin()

// Initialize Firestore Admin (with null check)
export const db = firebaseApp ? getFirestore(firebaseApp) : null

// Check if we have real Firebase configuration (not mock/test data)
export function hasRealFirebaseConfig(): boolean {
  try {
    return !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    )
  } catch (error) {
    console.error("Error checking Firebase config:", error)
    return false
  }
}

// Debug function for server-side use only
export function getFirebaseDebugInfo() {
  try {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || "not-set",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "not-set",
      hasApp: getApps().length > 0,
      hasDb: !!db,
      hasRealConfig: hasRealFirebaseConfig(),
      envVars: {
        NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      },
    }
  } catch (error) {
    console.error("Error getting Firebase debug info:", error)
    return {
      error: "Failed to get debug info",
      hasApp: false,
      hasDb: false,
      hasRealConfig: false,
    }
  }
}
