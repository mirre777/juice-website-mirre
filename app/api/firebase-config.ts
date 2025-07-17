import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

// Safe environment variable getter
function getEnvString(key: string, defaultValue = ""): string {
  const value = process.env[key]
  if (value === undefined || value === null) {
    return defaultValue
  }
  return String(value).trim()
}

// Initialize Firebase Admin SDK
let db: FirebaseFirestore

try {
  if (!getApps().length) {
    const projectId = getEnvString("FIREBASE_PROJECT_ID")
    const clientEmail = getEnvString("FIREBASE_CLIENT_EMAIL")
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing required Firebase environment variables")
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  db = getFirestore()
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create a mock db object to prevent crashes
  db = {} as FirebaseFirestore
}

export { db }

export function hasRealFirebaseConfig(): boolean {
  try {
    const required = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

    return required.every((key) => {
      const value = getEnvString(key)
      return value.length > 0
    })
  } catch {
    return false
  }
}

export function getFirebaseDebugInfo() {
  return {
    hasConfig: hasRealFirebaseConfig(),
    projectId: getEnvString("FIREBASE_PROJECT_ID") ? "✓ Set" : "✗ Missing",
    clientEmail: getEnvString("FIREBASE_CLIENT_EMAIL") ? "✓ Set" : "✗ Missing",
    privateKey: getEnvString("FIREBASE_PRIVATE_KEY") ? "✓ Set" : "✗ Missing",
  }
}
