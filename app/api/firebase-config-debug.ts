// This is a debug version of the Firebase configuration
// It logs more information about the initialization process

import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Log the environment variables (without exposing sensitive values)
console.log("Firebase environment variables check:", {
  apiKey: process.env.FIREBASE_API_KEY ? "Set" : "Not set",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
  projectId: process.env.FIREBASE_PROJECT_ID ? "Set" : "Not set",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ? "Set" : "Not set",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Not set",
  appId: process.env.FIREBASE_APP_ID ? "Set" : "Not set",
})

// Log the public environment variables
console.log("Public Firebase environment variables:", {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
})

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

console.log("Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "Set (hidden)" : "Not set",
  appId: firebaseConfig.appId ? "Set (hidden)" : "Not set",
})

// Initialize Firebase
let app
let db

try {
  if (!getApps().length) {
    console.log("No existing Firebase app, initializing new one")
    app = initializeApp(firebaseConfig)
  } else {
    console.log("Using existing Firebase app")
    app = getApps()[0]
  }

  db = getFirestore(app)
  console.log("Firestore initialized successfully")

  // Uncomment to use emulator during development
  // if (process.env.NODE_ENV === 'development') {
  //   connectFirestoreEmulator(db, 'localhost', 8080)
  //   console.log("Connected to Firestore emulator")
  // }
} catch (error) {
  console.error("Error initializing Firebase:", error)
  throw error
}

export { db }
