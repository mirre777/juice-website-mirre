import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"

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
    const preserveOriginalName = formData.get("preserveOriginalName") === "true"

    console.log("[v0] Blog image upload request received", {
      hasFile: !!file,
      blogSlug,
      preserveOriginalName,
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

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[v0] Original image size:", file.size, "bytes")

    const compressedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside", // Maintain aspect ratio, don't crop
        withoutEnlargement: true, // Don't upscale smaller images
      })
      .webp({
        quality: 82, // High quality with good compression
        effort: 4, // Balance between compression time and file size
      })
      .withMetadata() // Preserve EXIF metadata as requested
      .toBuffer()

    console.log("[v0] Compressed image size:", compressedBuffer.length, "bytes")
    console.log("[v0] Compression ratio:", ((1 - compressedBuffer.length / file.size) * 100).toFixed(1) + "%")

    const timestamp = Date.now()

    let fileName: string

    if (preserveOriginalName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
      fileName = blogSlug
        ? `blog-images/${blogSlug}-${nameWithoutExt}-${timestamp}.webp`
        : `blog-images/${nameWithoutExt}-${timestamp}.webp`
    } else {
      fileName = blogSlug ? `blog-images/${blogSlug}-${timestamp}.webp` : `blog-images/general-${timestamp}.webp`
    }

    console.log("[v0] Uploading compressed blog image to Vercel Blob", { fileName })

    const blob = await put(fileName, compressedBuffer, {
      access: "public",
      allowOverwrite: false,
      contentType: "image/webp", // Set correct content type for WebP
    })

    console.log("[v0] Blog image upload successful", { url: blob.url })

    return NextResponse.json({
      url: blob.url,
      fileName: fileName,
      originalName: file.name,
      size: compressedBuffer.length, // Return compressed size
      type: "image/webp", // Return WebP type
      originalSize: file.size, // Include original size for reference
      compressionRatio: ((1 - compressedBuffer.length / file.size) * 100).toFixed(1) + "%",
    })
  } catch (error) {
    console.error("Blog image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
