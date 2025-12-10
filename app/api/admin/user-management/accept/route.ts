import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseClientDb, isBuildTime } from "@/lib/firebase-global-guard"

export async function POST(request: NextRequest) {
  if (isBuildTime()) {
    return NextResponse.json({ error: "Route not available during build time" }, { status: 503 })
  }

  const isDev = process.env.NODE_ENV === "development"
  if (isDev) {
    console.log("📞 CONTACTED USER API CALLED")
    console.log("🕐 Timestamp:", new Date().toISOString())
  }

  try {
    const db = await getFirebaseClientDb()
    const { userId } = await request.json()
    if (isDev) console.log("📊 User ID:", userId)

    if (!userId) {
      console.error("❌ User ID is required")
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      )
    }

    if (isDev) console.log("🔄 Updating user status to contacted...")

    const { doc, updateDoc, Timestamp } = await import("firebase/firestore")
    const userRef = doc(db, "potential_users", userId)
    await updateDoc(userRef, {
      status: "contacted",
      contactedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    if (isDev) console.log("✅ User status updated successfully")

    return NextResponse.json({
      success: true,
      message: "User marked as contacted successfully",
    })
  } catch (error) {
    console.error("❌ Error updating user status:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user status",
      },
      { status: 500 },
    )
  }
}
