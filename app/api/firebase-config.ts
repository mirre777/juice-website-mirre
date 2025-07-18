import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

let db: FirebaseFirestore.Firestore | null = null

export function hasRealFirebaseConfig(): boolean {
  const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

  return requiredEnvVars.every((envVar) => {
    const value = process.env[envVar]
    return value && value.trim() !== ""
  })
}

export function initializeFirebase() {
  if (typeof window !== "undefined") {
    // Client-side, don't initialize admin SDK
    return null
  }

  if (!hasRealFirebaseConfig()) {
    console.warn("Firebase configuration incomplete, skipping initialization")
    return null
  }

  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })

      db = getFirestore(app)
      console.log("Firebase Admin initialized successfully")
    } else {
      // Use existing app
      db = getFirestore()
      console.log("Using existing Firebase Admin instance")
    }

    return db
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return null
  }
}

// Initialize on module load (server-side only)
if (typeof window === "undefined") {
  db = initializeFirebase()
}

export { db }
