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

let db: any = undefined

if (!isBuildTime) {
  // Dynamic initialization only at runtime
  const initializeFirebaseAdmin = async () => {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

      const privateKey =
        privateKeyRaw && privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw

      if (projectId && clientEmail && privateKey) {
        const { cert, getApps, initializeApp } = await import("firebase-admin/app")
        const { getFirestore } = await import("firebase-admin/firestore")

        if (getApps().length === 0) {
          initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          })
        }

        db = getFirestore()
      }
    } catch (error) {
      console.error("Firebase Admin initialization error:", error)
      db = undefined
    }
  }

  // Initialize immediately if not build time
  initializeFirebaseAdmin()
} else {
  console.log("Build time detected - skipping Firebase Admin initialization")
}

export { db }
