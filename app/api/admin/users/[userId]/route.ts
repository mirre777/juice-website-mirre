import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { doc, deleteDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  console.log("🗑️ DELETE USER API CALLED")
  console.log("🕐 Timestamp:", new Date().toISOString())
  console.log("📊 User ID:", params.userId)

  try {
    if (!hasRealFirebaseConfig || !db) {
      console.error("❌ Firebase not properly configured")
      return NextResponse.json(
        {
          success: false,
          error: "Firebase not configured",
        },
        { status: 500 },
      )
    }

    if (!params.userId) {
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

    const userRef = doc(db, "potential_users", params.userId)
    await deleteDoc(userRef)

    console.log("✅ User deleted successfully")

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      userId: params.userId,
    })
  } catch (error) {
    console.error("❌ Error deleting user:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code || "unknown",
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
        errorCode: (error as any)?.code || "unknown",
      },
      { status: 500 },
    )
  }
}
