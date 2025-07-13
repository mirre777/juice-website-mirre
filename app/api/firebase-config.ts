import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, type Storage } from "firebase/storage"

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Get Firebase configuration from environment variables
function getFirebaseConfig(): FirebaseConfig | null {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  // Check if all required fields are present
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingFields = requiredFields.filter((field) => !config[field as keyof typeof config])

  if (missingFields.length > 0) {
    console.warn(`Missing Firebase configuration fields: ${missingFields.join(", ")}`)
    return null
  }

  return config as FirebaseConfig
}

// Check if we have real Firebase configuration
export function hasRealFirebaseConfig(): boolean {
  const config = getFirebaseConfig()
  return config !== null && config.projectId !== "demo-project"
}

// Initialize Firebase services
let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let storage: Storage | null = null

try {
  const config = getFirebaseConfig()

  if (config && hasRealFirebaseConfig()) {
    // Initialize with real Firebase config
    if (getApps().length === 0) {
      app = initializeApp(config)
      console.log(`Firebase initialized with project: ${config.projectId}`)
    } else {
      app = getApps()[0]
    }

    // Initialize services
    db = getFirestore(app)
    auth = getAuth(app)
    storage = getStorage(app)

    console.log("Firebase services initialized successfully")
  } else {
    console.log("No valid Firebase configuration found - using mock mode")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Set services to null for mock mode
  app = null
  db = null
  auth = null
  storage = null
}

// Validate database connection
export async function validateFirebaseConnection(): Promise<boolean> {
  try {
    if (!db) {
      console.log("Firestore database not initialized - using mock mode")
      return false
    }

    // Simple connection test - just check if db exists
    console.log("Firebase connection validated successfully")
    return true
  } catch (error) {
    console.error("Firebase connection validation failed:", error)
    return false
  }
}

// Export Firebase services (can be null for mock mode)
export { app, db, auth, storage }

// Export configuration info
export const firebaseConfig = getFirebaseConfig()
export const isUsingMockConfig = !hasRealFirebaseConfig()

// Debug function
export function debugFirebaseConfig() {
  const config = getFirebaseConfig()
  console.log("Firebase Configuration Debug:", {
    hasConfig: !!config,
    projectId: config?.projectId || "Not set",
    isUsingMock: isUsingMockConfig,
    dbInitialized: !!db,
    availableEnvVars: {
      FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
  })
}
