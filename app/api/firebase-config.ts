import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore"
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
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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

// Mock Firebase configuration for development
const mockConfig: FirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
}

// Initialize Firebase app
let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: Storage

try {
  const config = getFirebaseConfig() || mockConfig

  // Initialize Firebase app if not already initialized
  if (getApps().length === 0) {
    app = initializeApp(config)
    console.log(`Firebase initialized with project: ${config.projectId}`)
  } else {
    app = getApps()[0]
  }

  // Initialize Firestore
  db = getFirestore(app)

  // Connect to Firestore emulator in development if using mock config
  if (!getFirebaseConfig() && process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080)
      console.log("Connected to Firestore emulator")
    } catch (error) {
      console.log("Firestore emulator connection failed, using mock data")
    }
  }

  // Initialize Auth
  auth = getAuth(app)

  // Initialize Storage
  storage = getStorage(app)
} catch (error) {
  console.error("Firebase initialization error:", error)

  // Fallback initialization with mock config
  if (getApps().length === 0) {
    app = initializeApp(mockConfig)
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
}

// Export Firebase services
export { app, db, auth, storage }

// Export configuration info
export const firebaseConfig = getFirebaseConfig() || mockConfig
export const isUsingMockConfig = !getFirebaseConfig()

// Validation function
export async function validateFirebaseConnection(): Promise<boolean> {
  try {
    // Simple test to check if Firestore is accessible
    if (!db) {
      console.error("Firestore database not initialized")
      return false
    }

    console.log("Firebase connection validated successfully")
    return true
  } catch (error) {
    console.error("Firebase connection validation failed:", error)
    return false
  }
}

// Check if we have real Firebase config
export function hasRealFirebaseConfig(): boolean {
  return !!getFirebaseConfig()
}

// Debug function
export function debugFirebaseConfig() {
  const config = getFirebaseConfig()
  console.log("Firebase Configuration Debug:", {
    hasConfig: !!config,
    projectId: config?.projectId || "Not set",
    isUsingMock: isUsingMockConfig,
    availableEnvVars: {
      FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
    },
  })
}
