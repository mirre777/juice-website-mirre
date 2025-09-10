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
"use client"

const isBuildTime =
  typeof window === "undefined" &&
  (process.env.NODE_ENV === "production" ||
    process.env.CI === "true" ||
    process.env.VERCEL_ENV === "production" ||
    !process.env.VERCEL)

let auth: any = null
let db: any = null
let storage: any = null
let app: any = null

if (isBuildTime) {
  console.log("Build time detected - completely skipping client Firebase initialization")
} else {
  // Dynamic initialization only at runtime
  const initializeFirebase = async () => {
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      }

      const hasValidConfig = !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
      )

      if (hasValidConfig) {
        const { initializeApp, getApps } = await import("firebase/app")
        const { getAuth } = await import("firebase/auth")
        const { getFirestore } = await import("firebase/firestore")
        const { getStorage } = await import("firebase/storage")

        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
        auth = getAuth(app)
        db = getFirestore(app)
        storage = getStorage(app)
      } else {
        console.log("Invalid Firebase config - using mock services")
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
    }
  }

  // Initialize immediately if not build time
  initializeFirebase()
}

export { auth, db, storage }
export default app
