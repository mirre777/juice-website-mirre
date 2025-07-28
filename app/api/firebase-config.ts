import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

console.log("Firebase config check:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  apiKeyPrefix: firebaseConfig.apiKey?.substring(0, 10) + "...",
})

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId !== "your-project-id" &&
  firebaseConfig.apiKey.length > 10
)

console.log("hasRealFirebaseConfig:", hasRealFirebaseConfig)

let app: FirebaseApp
let db: Firestore | null = null

if (hasRealFirebaseConfig) {
  try {
    console.log("Initializing Firebase with real config...")

    // Initialize Firebase app
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    console.log("Firebase app initialized:", app.name)

    // Initialize Firestore
    db = getFirestore(app)
    console.log("Firestore initialized successfully")

    // Connect to Firestore emulator in development if needed
    if (process.env.NODE_ENV === "development" && process.env.USE_FIRESTORE_EMULATOR === "true") {
      try {
        connectFirestoreEmulator(db, "localhost", 8080)
        console.log("Connected to Firestore emulator")
      } catch (error) {
        console.log("Firestore emulator already connected or not available")
      }
    }

    console.log("Firebase initialized successfully with project:", firebaseConfig.projectId)
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    console.error("Firebase initialization error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    })
    db = null
  }
} else {
  console.log("Firebase configuration not found or incomplete. Using mock mode.")
  console.log("Config status:", {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    apiKeyLength: firebaseConfig.apiKey?.length,
    projectId: firebaseConfig.projectId,
  })
}

export { db }
export default app
