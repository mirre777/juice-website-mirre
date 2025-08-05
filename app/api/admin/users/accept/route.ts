import { type NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  console.log("📞 ACCEPT USER API CALLED")
  console.log("🕐 Timestamp:", new Date().toISOString())

  try {
    if (!db) {
      console.error("❌ Firebase not configured")
      return NextResponse.json(
        {
          success: false,
          error: "Firebase not configured",
        },
        { status: 500 },
      )
    }

    const { userId } = await request.json()
    console.log("📊 User ID:", userId)

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

    console.log("🔄 Updating user status to contacted...")

    const userRef = doc(db, "potential_users", userId)
    await updateDoc(userRef, {
      status: "contacted",
      contactedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    console.log("✅ User status updated successfully")

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
