import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"

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
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "not-set",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "not-set",
    hasApp: !!app,
    hasDb: !!db,
    envVars: {
      FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
  }
}
