import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Safely get environment variable as string
function getEnvString(key: string, defaultValue = ""): string {
  const value = process.env[key]
  if (value === undefined || value === null) {
    return defaultValue
  }
  return String(value)
}

// Initialize Firebase Admin SDK with proper error handling
function initializeFirebaseAdmin() {
  // Return existing app if already initialized
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Safely extract and validate environment variables
    const projectId = getEnvString("FIREBASE_PROJECT_ID")
    const clientEmail = getEnvString("FIREBASE_CLIENT_EMAIL")
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")

    // Validate required configuration
    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Missing Firebase configuration - using fallback")
      return null
    }

    // Initialize with validated string values
    const app = initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
      projectId: projectId,
    })

    return app
  } catch (error) {
    console.error("Firebase Admin initialization failed:", String(error))
    return null
  }
}

// Initialize Firestore with fallback
let db: any = null
try {
  const app = initializeFirebaseAdmin()
  if (app) {
    db = getFirestore(app)
  }
} catch (error) {
  console.error("Firestore initialization failed:", String(error))
  db = null
}

export { db }

// Check if Firebase is properly configured
export function hasRealFirebaseConfig(): boolean {
  try {
    const requiredEnvVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ]

    return requiredEnvVars.every((varName) => {
      const value = process.env[varName]
      return typeof value === "string" && value.length > 0
    })
  } catch (error) {
    return false
  }
}

// Debug function for server-side diagnostics
export function getFirebaseDebugInfo() {
  try {
    return {
      projectId: getEnvString("FIREBASE_PROJECT_ID"),
      authDomain: getEnvString("FIREBASE_AUTH_DOMAIN"),
      hasApp: getApps().length > 0,
      hasDb: db !== null,
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
    return {
      error: String(error),
      hasApp: false,
      hasDb: false,
      hasRealConfig: false,
      envVars: {},
    }
  }
}
