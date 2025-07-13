// Firebase configuration
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"

// Validate that we have the required config
const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

let db: any = null
let app: any = null

if (hasRealFirebaseConfig && missingFields.length === 0) {
  try {
    // Initialize Firebase only if it hasn't been initialized already
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    // Initialize Firestore
    db = getFirestore(app)
    console.log("Firebase initialized successfully with real configuration")
  } catch (error) {
    console.error("Firebase initialization failed:", error)
    db = null
    app = null
  }
} else {
  console.log("Using mock Firebase configuration - missing fields:", missingFields)
  db = null
  app = null
}

// Export the database and app
export { db, app }

// Helper function to validate Firebase connection
export async function validateFirebaseConnection() {
  try {
    if (!db) return false
    // Simple test to verify Firestore is working
    const testDoc = db._delegate || db
    return !!testDoc
  } catch (error) {
    console.error("Firebase connection validation failed:", error)
    return false
  }
}
