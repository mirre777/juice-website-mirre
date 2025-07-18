import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type FirebaseFirestore } from "firebase-admin/firestore"

let db: FirebaseFirestore.Firestore | null = null

export function hasRealFirebaseConfig(): boolean {
  return !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
}

export function initializeFirebase() {
  try {
    if (!hasRealFirebaseConfig()) {
      console.warn("Firebase configuration incomplete - some features may not work")
      return null
    }

    // Check if Firebase Admin is already initialized
    if (getApps().length > 0) {
      const app = getApps()[0]
      db = getFirestore(app)
      return db
    }

    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    })

    db = getFirestore(app)
    console.log("Firebase Admin initialized successfully")
    return db
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return null
  }
}

// Initialize on import (server-side only)
if (typeof window === "undefined") {
  db = initializeFirebase()
}

export { db }
