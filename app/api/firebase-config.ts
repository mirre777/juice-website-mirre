import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Firebase configuration using environment variables
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
export const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Debug function to check Firebase configuration
export function getFirebaseDebugInfo() {
  return {
    hasRealConfig: hasRealFirebaseConfig,
    projectId: process.env.FIREBASE_PROJECT_ID || "Not set",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "Not set",
    apiKeySet: !!process.env.FIREBASE_API_KEY,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "Not set",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "Not set",
    appId: process.env.FIREBASE_APP_ID || "Not set",
  }
}
