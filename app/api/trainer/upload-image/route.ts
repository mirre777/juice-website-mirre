import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const trainerId = formData.get("trainerId") as string

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

    // Create storage reference
    const fileExtension = file.name.split(".").pop()
    const fileName = `profile.${fileExtension}`
    const storageRef = ref(storage, `trainers/${trainerId}/${fileName}`)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Firebase Storage
    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    })

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef)

    return NextResponse.json({ url: downloadURL })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
