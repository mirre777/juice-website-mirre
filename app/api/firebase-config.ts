import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase app (singleton pattern)
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error("Firebase initialization error:", error)
  throw error
}

// Initialize Firestore
let db
try {
  db = getFirestore(app)
} catch (error) {
  console.error("Firestore initialization error:", error)
  throw error
}

// Debug function to get Firebase configuration info
export function getFirebaseDebugInfo() {
  return {
    hasApp: !!app,
    hasDb: !!db,
    projectId: firebaseConfig.projectId || "not-set",
    authDomain: firebaseConfig.authDomain || "not-set",
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

export { app, db }
