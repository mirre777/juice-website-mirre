import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.FIREBASE_API_KEY &&
  process.env.FIREBASE_API_KEY !== "mock-api-key"

// Initialize Firebase
let app: FirebaseApp
let db: Firestore

if (hasRealFirebaseConfig) {
  // Initialize Firebase with real config
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
} else {
  // Mock configuration for development/testing
  console.warn("Using mock Firebase configuration")
  // Create a mock app and db for development
  app = {} as FirebaseApp
  db = {} as Firestore
}

export { app, db }

export function getFirebaseDebugInfo() {
  return {
    hasRealConfig: hasRealFirebaseConfig,
    projectId: process.env.FIREBASE_PROJECT_ID || "Not set",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "Not set",
    configComplete: !!(
      process.env.FIREBASE_API_KEY &&
      process.env.FIREBASE_AUTH_DOMAIN &&
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_STORAGE_BUCKET &&
      process.env.FIREBASE_MESSAGING_SENDER_ID &&
      process.env.FIREBASE_APP_ID
    ),
  }
}
