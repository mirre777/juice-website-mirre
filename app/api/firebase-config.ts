import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.FIREBASE_API_KEY &&
  process.env.FIREBASE_API_KEY !== "mock-api-key"

// Initialize Firebase
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

// Initialize Firestore
export const db = getFirestore(app)

// Connect to emulator in development if specified
if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
  try {
    connectFirestoreEmulator(db, "localhost", 8080)
  } catch (error) {
    // Emulator already connected
  }
}

export { app }

export function getFirebaseDebugInfo() {
  return {
    hasRealConfig: hasRealFirebaseConfig,
    projectId: process.env.FIREBASE_PROJECT_ID || "not-set",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "not-set",
    hasApp: !!app,
    hasDb: !!db,
    envVars: {
      FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: !!process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: !!process.env.FIREBASE_APP_ID,
    },
  }
}
