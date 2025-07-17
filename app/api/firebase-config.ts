import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

// Helper function to safely get environment variable as string
function getEnvString(key: string): string {
  const value = process.env[key]
  return typeof value === "string" ? value : ""
}

// Helper function to check if we have real Firebase config
export function hasRealFirebaseConfig(): boolean {
  try {
    const apiKey = getEnvString("FIREBASE_API_KEY")
    const projectId = getEnvString("FIREBASE_PROJECT_ID")
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY")

    return !!(
      apiKey &&
      projectId &&
      privateKey &&
      apiKey !== "your-api-key" &&
      projectId !== "your-project-id" &&
      privateKey !== "your-private-key"
    )
  } catch (error) {
    console.error("Error checking Firebase config:", error)
    return false
  }
}

// Initialize Firebase Admin
let db: FirebaseFirestore.Firestore

try {
  if (getApps().length === 0) {
    const privateKey = getEnvString("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")

    const app = initializeApp({
      credential: cert({
        projectId: getEnvString("FIREBASE_PROJECT_ID"),
        clientEmail: getEnvString("FIREBASE_CLIENT_EMAIL"),
        privateKey: privateKey,
      }),
    })

    db = getFirestore(app)
  } else {
    db = getFirestore()
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create a mock db object to prevent crashes
  db = {} as FirebaseFirestore.Firestore
}

export { db }

export function getFirebaseDebugInfo() {
  return {
    hasConfig: hasRealFirebaseConfig(),
    projectId: getEnvString("FIREBASE_PROJECT_ID"),
    clientEmail: getEnvString("FIREBASE_CLIENT_EMAIL"),
    hasPrivateKey: !!getEnvString("FIREBASE_PRIVATE_KEY"),
    appsLength: getApps().length,
  }
}
