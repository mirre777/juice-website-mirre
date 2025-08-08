import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

// Some environments store private key with escaped \n — normalize it safely
const privateKey =
  privateKeyRaw && privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw

if (!projectId || !clientEmail || !privateKey) {
  // We intentionally don't throw at module load — the route will surface a clear JSON error
  // when these are missing. This avoids hard crashes that lead to generic 500 text responses.
}

if (getApps().length === 0 && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

export const db = (() => {
  try {
    return getFirestore()
  } catch {
    // If initializeApp didn't run due to missing envs, caller will handle this case.
    return undefined as unknown as ReturnType<typeof getFirestore>
  }
})()
