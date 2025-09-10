/**
 * IMPORTANT: Firebase Build-Time Issues
 *
 * Before modifying this file, please read docs/FIREBASE_BUILD_ISSUES.md
 * This file contains critical build-time detection logic to prevent
 * Firebase initialization during Next.js build process.
 *
 * Any changes to imports or initialization logic should follow the
 * patterns documented in FIREBASE_BUILD_ISSUES.md to avoid deployment failures.
 */

const isBuildTime =
  typeof window === "undefined" &&
  (process.env.NODE_ENV === "production" ||
    process.env.CI === "true" ||
    process.env.VERCEL_ENV === "production" ||
    !process.env.VERCEL)

let hasRealFirebaseConfig = false
let db = null

if (isBuildTime) {
  console.log("Build time detected - completely skipping Firebase initialization")
} else {
  // Dynamic initialization only at runtime
  const initializeFirebase = async () => {
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId:
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
      }

      hasRealFirebaseConfig = !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId &&
        firebaseConfig.projectId !== "demo-project" &&
        firebaseConfig.apiKey !== "demo-key"
      )

      console.log("Has real Firebase config:", hasRealFirebaseConfig)

      if (hasRealFirebaseConfig) {
        const { initializeApp, getApps } = await import("firebase/app")
        const { getFirestore } = await import("firebase/firestore")

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
        db = getFirestore(app)
        console.log("Firebase initialized successfully with real config")
      } else {
        console.log("Using mock Firebase configuration")
        db = null
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      db = null
    }
  }

  // Initialize immediately if not build time
  initializeFirebase()
}

export { hasRealFirebaseConfig, db }
