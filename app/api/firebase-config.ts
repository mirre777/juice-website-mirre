import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

let db: FirebaseFirestore.Firestore | null = null

export function hasRealFirebaseConfig(): boolean {
  return !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
}

export function hasFirebaseConfig(): boolean {
  return hasRealFirebaseConfig()
}

function initializeFirebase() {
  if (typeof window !== "undefined") {
    // Client-side: return null, Firebase Admin is server-only
    return null
  }

  if (!hasRealFirebaseConfig()) {
    console.warn("Firebase configuration incomplete")
    return null
  }

  try {
    // Check if Firebase app is already initialized
    if (getApps().length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    }

    return getFirestore()
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return null
  }
}

// Initialize Firebase and get Firestore instance
if (!db && typeof window === "undefined") {
  db = initializeFirebase()
}

export { db }
