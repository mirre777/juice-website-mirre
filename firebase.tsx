// firebase.tsx
import { initializeApp } from "firebase/app"
import { db } from "@/app/api/firebase-config"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

export function initializeFirebase() {
  return initializeApp(firebaseConfig)
}

// Re-export the db
export { db }

// Add a helper function to check if Firestore is available
// Always returns false since we're using a mock implementation
export function isFirestoreAvailable() {
  return false
}
