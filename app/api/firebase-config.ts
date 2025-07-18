import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

let db: any = null
let isInitialized = false

export function hasFirebaseConfig(): boolean {
  const required = [
    process.env.FIREBASE_PROJECT_ID,
    process.env.FIREBASE_CLIENT_EMAIL,
    process.env.FIREBASE_PRIVATE_KEY,
  ]
  return required.every((val) => val && val.length > 0)
}

export function initializeFirebaseAdmin() {
  if (isInitialized || typeof window !== "undefined") {
    return db
  }

  try {
    if (!hasFirebaseConfig()) {
      console.warn("Firebase Admin config incomplete")
      return null
    }

    if (getApps().length === 0) {
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      })

      db = getFirestore(app)
      isInitialized = true
      console.log("Firebase Admin initialized successfully")
    } else {
      db = getFirestore()
    }

    return db
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    return null
  }
}

// Initialize on server-side
if (typeof window === "undefined") {
  db = initializeFirebaseAdmin()
}

export { db }

// Client-side Firebase config
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
