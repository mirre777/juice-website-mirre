import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

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

    const fileExtension = file.name.split(".").pop()
    const fileName = `trainers/${trainerId}/profile.${fileExtension}`

    console.log("[v0] Uploading to Vercel Blob", { fileName })

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      allowOverwrite: true,
    })

    console.log("[v0] Upload successful", { url: blob.url })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
