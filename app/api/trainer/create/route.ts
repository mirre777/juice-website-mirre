import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

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
  // Parse body with defensive error handling
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

  // Validate required fields
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

  // Ensure Firestore is available
  if (!db) {
    return json(500, {
      error: "Server not configured",
      details:
        "Firebase Admin is not initialized. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    })
  }

  // Build document
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

  try {
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
    // Always return JSON so the client doesn't attempt to parse plain text
    return json(500, {
      error: "Failed to create trainer profile",
      details: err instanceof Error ? err.message : "Unknown error",
    })
  }
}
