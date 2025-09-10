/**
 * CRITICAL: READ docs/FIREBASE_BUILD_ISSUES.md BEFORE MAKING CHANGES
 * This file uses Firebase Admin SDK and requires build-time detection to prevent
 * initialization errors during Next.js builds.
 */

import { type NextRequest, NextResponse } from "next/server"

type CreateBody = {
  fullName?: string
  email?: string
  phone?: string
  city?: string
  district?: string
  specialty?: string
  certifications?: string
  bio?: string
  services?: string[]
}

function json(status: number, data: any) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  })
}

function makeTempId() {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function POST(request: NextRequest) {
  if (process.env.CI === "true" || process.env.NEXT_PHASE === "phase-production-build") {
    console.log("Build time detected - completely skipping Firebase initialization in trainer create route")
    return json(503, { error: "Service temporarily unavailable during build" })
  }

  // 1) Parse body safely
  let body: CreateBody
  try {
    body = await request.json()
  } catch {
    return json(400, { error: "Invalid request body", details: "Expected JSON payload." })
  }

  const {
    fullName = "",
    email = "",
    phone = "",
    city = "",
    district = "",
    specialty = "",
    certifications = "",
    bio = "",
    services = [],
  } = body

  // 2) Validate inputs (expected error handling)
  const errors: Record<string, string> = {}
  if (!fullName.trim()) errors.fullName = "Full name is required"
  if (!email.trim()) errors.email = "Email is required"
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format"
  if (!city.trim()) errors.city = "City is required"
  if (!district.trim()) errors.district = "District is required"
  if (!specialty.trim()) errors.specialty = "Specialty is required"

  if (Object.keys(errors).length > 0) {
    return json(400, { error: "Validation failed", details: errors })
  }

  // 3) Build the document
  const now = new Date()
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000) // +24h
  const tempId = makeTempId()

  const doc = {
    id: tempId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || "",
    city: city.trim(),
    district: district.trim(),
    specialty: specialty.trim(),
    certifications: certifications?.trim() || "",
    bio: bio?.trim() || "",
    services: Array.isArray(services) ? services : [],
    status: "temp" as const,
    isActive: false,
    isPaid: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    customization: {
      isDraft: false,
      lastUpdated: now.toISOString(),
      version: 1,
    },
  }

  // 4) Lazy-initialize Firebase Admin and write to Firestore
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    let privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId) {
      console.error("Missing FIREBASE_PROJECT_ID environment variable")
      return json(500, {
        error: "Server misconfiguration",
        details: "Firebase project ID is not configured. Please check environment variables.",
      })
    }

    if (!clientEmail) {
      console.error("Missing FIREBASE_CLIENT_EMAIL environment variable")
      return json(500, {
        error: "Server misconfiguration",
        details: "Firebase client email is not configured. Please check environment variables.",
      })
    }

    if (!privateKey) {
      console.error("Missing FIREBASE_PRIVATE_KEY environment variable")
      return json(500, {
        error: "Server misconfiguration",
        details: "Firebase private key is not configured. Please check environment variables.",
      })
    }

    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n")
    }

    // Dynamic import to avoid crashing at module load time
    const { getApps, initializeApp, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      })
    }

    const db = getFirestore()
    await db.collection("trainers").doc(tempId).set(doc, { merge: false })

    const redirectUrl = `/marketplace/trainer/temp/${tempId}`
    return json(200, {
      success: true,
      tempId,
      redirectUrl,
      message: "Trainer profile created successfully",
    })
  } catch (err) {
    console.error("Error creating trainer doc:", err)
    return json(500, {
      error: "Failed to create trainer profile",
      details: err instanceof Error ? err.message : "Unknown error",
    })
  }
}
