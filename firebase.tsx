"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getAnalytics, type Analytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  // Temporarily comment out measurementId to prevent Google Analytics errors
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
}

let app: FirebaseApp
let db: Firestore
let auth: Auth
let analytics: Analytics | null = null

try {
  // Initialize Firebase
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  // Initialize Firestore
  db = getFirestore(app)

  // Initialize Auth
  auth = getAuth(app)

  // Initialize Analytics only in browser environment and with valid config
  if (typeof window !== "undefined" && firebaseConfig.apiKey) {
    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.warn("Analytics initialization failed:", error)
      analytics = null
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Provide fallback values to prevent app crashes
  app = {} as FirebaseApp
  db = {} as Firestore
  auth = {} as Auth
}

export { app, db, auth, analytics }
export default app
