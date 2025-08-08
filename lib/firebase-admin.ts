import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Prefer server-side vars; fall back to NEXT_PUBLIC only if necessary
const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

// Normalize private key newlines if provided as escaped string
const privateKey =
  privateKeyRaw && privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw

// Initialize Admin SDK once
if (getApps().length === 0 && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

// Export Firestore or undefined; callers must check
export const db = (() => {
  try {
    return getFirestore()
  } catch {
    return undefined as unknown as ReturnType<typeof getFirestore>
  }
})()
