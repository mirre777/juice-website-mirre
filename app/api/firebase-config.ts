import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getEnvString(key: string): string {
  const value = process.env[key]
  if (value === undefined || value === null) {
    return ""
  }
  return String(value)
}

export function hasRealFirebaseConfig(): boolean {
  try {
    const projectId = getEnvString("FIREBASE_PROJECT_ID")
    const clientEmail = getEnvString("FIREBASE_CLIENT_EMAIL")
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY")

    return Boolean(projectId && clientEmail && privateKey)
  } catch (error) {
    console.error("Error checking Firebase config:", error)
    return false
  }
}

let db: any = null

try {
  if (!getApps().length && hasRealFirebaseConfig()) {
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")

    // Initialize Firebase Admin with logging disabled
    initializeApp({
      credential: cert({
        projectId: getEnvString("FIREBASE_PROJECT_ID"),
        clientEmail: getEnvString("FIREBASE_CLIENT_EMAIL"),
        privateKey: privateKey,
      }),
      // Disable Google logging utilities
      projectId: getEnvString("FIREBASE_PROJECT_ID"),
    })

    db = getFirestore()

    // Disable Firestore logging
    if (db && typeof db.settings === "function") {
      db.settings({
        ignoreUndefinedProperties: true,
      })
    }

    console.log("Firebase Admin initialized successfully (Google logging disabled)")
  } else if (!hasRealFirebaseConfig()) {
    console.warn("Firebase configuration incomplete - using mock mode")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export { db }

export function getFirebaseDebugInfo() {
  return {
    hasConfig: hasRealFirebaseConfig(),
    projectId: getEnvString("FIREBASE_PROJECT_ID") ? "✓ Set" : "✗ Missing",
    clientEmail: getEnvString("FIREBASE_CLIENT_EMAIL") ? "✓ Set" : "✗ Missing",
    privateKey: getEnvString("FIREBASE_PRIVATE_KEY") ? "✓ Set" : "✗ Missing",
    isInitialized: Boolean(db),
    googleLogging: "Disabled",
  }
}
