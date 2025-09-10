import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseClientDb, isBuildTime } from "@/lib/firebase-global-guard"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  if (isBuildTime()) {
    return NextResponse.json({ error: "Route not available during build time" }, { status: 503 })
  }

  console.log("🗑️ DELETE USER API CALLED")
  console.log("🕐 Timestamp:", new Date().toISOString())
  console.log("📊 User ID:", params.userId)

  try {
    const db = await getFirebaseClientDb()

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

    const { doc, deleteDoc } = await import("firebase/firestore")
    const userRef = doc(db, "potential_users", params.userId)
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
