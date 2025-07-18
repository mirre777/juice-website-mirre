"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

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

// Initialize Firebase only if it hasn't been initialized yet
let app
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    console.log("Firebase client initialized successfully (Google logging disabled)")
  } catch (error) {
    console.error("Firebase client initialization error:", error)
  }
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// Disable Firestore logging on client side
if (db && typeof db._delegate?.settings === "function") {
  try {
    db._delegate.settings({
      ignoreUndefinedProperties: true,
    })
  } catch (error) {
    // Ignore settings errors
  }
}

export default app
