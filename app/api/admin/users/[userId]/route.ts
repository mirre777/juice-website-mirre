import { type NextRequest, NextResponse } from "next/server"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  console.log("🗑️ DELETE USER API CALLED")
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

    const { userId } = params
    console.log("📊 User ID to delete:", userId)

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

    console.log("🔄 Deleting user from potential_users collection...")

    const userRef = doc(db, "potential_users", userId)
    await deleteDoc(userRef)

    console.log("✅ User deleted successfully")

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("❌ Error deleting user:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 },
    )
  }
}
