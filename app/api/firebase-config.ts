import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Ensure all environment variables are strings
    const projectId = String(process.env.FIREBASE_PROJECT_ID || "")
    const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || "")
    const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing required Firebase configuration")
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
    throw error
  }
}

// Initialize Firestore Admin
export const db = getFirestore(initializeFirebaseAdmin())

// Check if we have real Firebase configuration (not mock/test data)
export function hasRealFirebaseConfig(): boolean {
  try {
    const requiredVars = [
      process.env.FIREBASE_PROJECT_ID,
      process.env.FIREBASE_CLIENT_EMAIL,
      process.env.FIREBASE_PRIVATE_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ]

    return requiredVars.every((variable) => {
      return typeof variable === "string" && variable.length > 0
    })
  } catch (error) {
    console.error("Error checking Firebase config:", error)
    return false
  }
}

// Debug function for server-side use only
export function getFirebaseDebugInfo() {
  try {
    return {
      projectId: String(process.env.FIREBASE_PROJECT_ID || ""),
      authDomain: String(process.env.FIREBASE_AUTH_DOMAIN || ""),
      hasApp: getApps().length > 0,
      hasDb: !!db,
      hasRealConfig: hasRealFirebaseConfig(),
      envVars: {
        NEXT_PUBLIC_FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        NEXT_PUBLIC_FIREBASE_APP_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
        FIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
        FIREBASE_CLIENT_EMAIL: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
        FIREBASE_PRIVATE_KEY: Boolean(process.env.FIREBASE_PRIVATE_KEY),
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
