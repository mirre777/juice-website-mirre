import { type NextRequest, NextResponse } from "next/server"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

export async function POST(request: NextRequest) {
  if (isBuildTime) {
    console.log("Build time detected - skipping upload-image route")
    return NextResponse.json({ error: "Service temporarily unavailable during build" }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const trainerId = formData.get("trainerId") as string

    console.log("[v0] Upload request received", {
      hasFile: !!file,
      trainerId,
      fileType: file?.type,
      fileSize: file?.size,
    })

    if (!file || !trainerId) {
      return NextResponse.json({ error: "File and trainer ID are required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum 5MB allowed." }, { status: 400 })
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    let privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      console.error("Missing Firebase configuration", {
        projectId: !!projectId,
        clientEmail: !!clientEmail,
        privateKey: !!privateKey,
      })
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n")
    }

    // Dynamic import Firebase Admin
    const { getApps, initializeApp, cert } = await import("firebase-admin/app")
    const { getStorage } = await import("firebase-admin/storage")

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      })
    }

    const storage = getStorage()
    const bucket = storage.bucket()

    // Create file path and metadata
    const fileExtension = file.name.split(".").pop()
    const fileName = `trainers/${trainerId}/profile.${fileExtension}`

    console.log("[v0] Uploading to Firebase Storage", { fileName, bucket: bucket.name })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Firebase Storage
    const fileRef = bucket.file(fileName)
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    })

    // Make file publicly accessible
    await fileRef.makePublic()

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    console.log("[v0] Upload successful", { publicUrl })

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
