import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

export async function POST(request: NextRequest) {
  if (isBuildTime) {
    console.log("Build time detected - skipping blog image upload route")
    return NextResponse.json({ error: "Service temporarily unavailable during build" }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const blogSlug = formData.get("blogSlug") as string

    console.log("[v0] Blog image upload request received", {
      hasFile: !!file,
      blogSlug,
      fileType: file?.type,
      fileSize: file?.size,
    })

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (10MB max for blog images)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum 10MB allowed." }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()
    const timestamp = Date.now()

    // Create filename: blog-images/slug-timestamp.ext or blog-images/general-timestamp.ext
    const fileName = blogSlug
      ? `blog-images/${blogSlug}-${timestamp}.${fileExtension}`
      : `blog-images/general-${timestamp}.${fileExtension}`

    console.log("[v0] Uploading blog image to Vercel Blob", { fileName })

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      allowOverwrite: false, // Don't overwrite to preserve unique filenames
    })

    console.log("[v0] Blog image upload successful", { url: blob.url })

    return NextResponse.json({
      url: blob.url,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Blog image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
