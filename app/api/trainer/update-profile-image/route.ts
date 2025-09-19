import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseAdminDb, isBuildTime } from "@/lib/firebase-global-guard"

export async function POST(request: NextRequest) {
  if (isBuildTime()) {
    return NextResponse.json({ error: "Route not available during build time" }, { status: 503 })
  }

  try {
    const { trainerId, profileImage } = await request.json()

    console.log("[v0] Profile image update request received", {
      trainerId,
      profileImage: profileImage?.substring(0, 100) + "...",
    })

    if (!trainerId || !profileImage) {
      return NextResponse.json({ error: "Trainer ID and profile image URL are required" }, { status: 400 })
    }

    const db = await getFirebaseAdminDb()
    const trainerRef = db.collection("trainers").doc(trainerId)
    const currentDoc = await trainerRef.get()
    const currentData = currentDoc.data()

    console.log("[v0] Current profile image in database", {
      currentProfileImage: currentData?.profileImage?.substring(0, 100) + "...",
      newProfileImage: profileImage.substring(0, 100) + "...",
      isSame: currentData?.profileImage === profileImage,
    })

    // Update trainer document with new profile image
    const updateData = {
      profileImage,
      updatedAt: new Date().toISOString(),
    }

    await trainerRef.update(updateData)

    console.log("[v0] Database update completed successfully")

    const updatedDoc = await trainerRef.get()
    const updatedData = updatedDoc.data()

    console.log("[v0] Verification read after update", {
      updatedProfileImage: updatedData?.profileImage?.substring(0, 100) + "...",
      updateSuccessful: updatedData?.profileImage === profileImage,
      updatedAt: updatedData?.updatedAt,
    })

    return NextResponse.json({
      success: true,
      debug: {
        oldImage: currentData?.profileImage?.substring(0, 50) + "...",
        newImage: profileImage.substring(0, 50) + "...",
        updateVerified: updatedData?.profileImage === profileImage,
      },
    })
  } catch (error) {
    console.error("[v0] Profile image update error:", error)
    return NextResponse.json({ error: "Failed to update profile image" }, { status: 500 })
  }
}
