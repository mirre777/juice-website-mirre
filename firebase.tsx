"use client"

// COMPLETELY REMOVED ALL GOOGLE ANALYTICS AND FIREBASE ANALYTICS
// This file now only contains basic Firebase setup without any analytics

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Basic Firebase config without any analytics or measurement ID
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  // NO measurementId - completely removed
  // NO analytics imports - completely removed
}

// Initialize Firebase without analytics
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Only export basic Firebase services - NO ANALYTICS
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
