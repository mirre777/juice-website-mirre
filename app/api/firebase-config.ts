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

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Safely extract environment variables as strings
    const projectId = getEnvString("FIREBASE_PROJECT_ID")
    const clientEmail = getEnvString("FIREBASE_CLIENT_EMAIL")
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")

    // Validate required fields
    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Missing Firebase configuration, using mock setup")
      throw new Error("Missing required Firebase environment variables")
    }

    // Create credential object with validated strings
    const credential = cert({
      projectId: projectId,
      clientEmail: clientEmail,
      privateKey: privateKey,
    })

    const app = initializeApp({
      credential: credential,
      projectId: projectId,
    })

    console.log("Firebase Admin initialized successfully")
    return app
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error instanceof Error ? error.message : String(error))
    throw error
  }
}

// Initialize Firestore Admin with error handling
let db: any
try {
  db = getFirestore(initializeFirebaseAdmin())
} catch (error) {
  console.error("Failed to initialize Firestore:", error instanceof Error ? error.message : String(error))
  // Create a mock db object to prevent further errors
  db = null
}

export { db }

// Check if we have real Firebase configuration
export function hasRealFirebaseConfig(): boolean {
  try {
    const requiredVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ]

    return requiredVars.every((varName) => {
      const value = process.env[varName]
      return typeof value === "string" && value.length > 0
    })
  } catch (error) {
    console.error("Error checking Firebase config:", error instanceof Error ? error.message : String(error))
    return false
  }
}

// Debug function for server-side use only
export function getFirebaseDebugInfo() {
  try {
    const safeGetEnv = (key: string) => {
      const value = process.env[key]
      return typeof value === "string" && value.length > 0
    }

    return {
      projectId: getEnvString("FIREBASE_PROJECT_ID"),
      authDomain: getEnvString("FIREBASE_AUTH_DOMAIN"),
      hasApp: getApps().length > 0,
      hasDb: db !== null,
      hasRealConfig: hasRealFirebaseConfig(),
      envVars: {
        NEXT_PUBLIC_FIREBASE_API_KEY: safeGetEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
        NEXT_PUBLIC_FIREBASE_APP_ID: safeGetEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
        FIREBASE_PROJECT_ID: safeGetEnv("FIREBASE_PROJECT_ID"),
        FIREBASE_CLIENT_EMAIL: safeGetEnv("FIREBASE_CLIENT_EMAIL"),
        FIREBASE_PRIVATE_KEY: safeGetEnv("FIREBASE_PRIVATE_KEY"),
      },
    }
  } catch (error) {
    console.error("Error getting Firebase debug info:", error instanceof Error ? error.message : String(error))
    return {
      error: "Failed to get debug info",
      hasApp: false,
      hasDb: false,
      hasRealConfig: false,
      envVars: {},
    }
  }
}
