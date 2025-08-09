import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Prefer server-side envs; NEXT_PUBLIC values are fallback only (not ideal for secrets).
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

// Normalize escaped newlines if present
const privateKey = privateKeyRaw && privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw

// Initialize Admin exactly once and only if all credentials are present
if (getApps().length === 0 && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

// Export Firestore, but keep it undefined if init didn’t happen.
// Callers must guard against undefined to avoid crashing at import time.
export const db = (() => {
  try {
    return getFirestore()
  } catch {
    return undefined as unknown as ReturnType<typeof getFirestore>
  }
})()
