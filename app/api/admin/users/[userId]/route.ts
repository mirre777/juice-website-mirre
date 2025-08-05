import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { doc, deleteDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  console.log("🗑️ DELETE USER API CALLED")
  console.log("📊 User ID:", params.userId)
  console.log("🕐 Timestamp:", new Date().toISOString())

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

    console.log("🔥 Attempting to delete user from Firebase...")

    // Delete the document from the potential_users collection
    const userDocRef = doc(db, "potential_users", params.userId)
    await deleteDoc(userDocRef)

    console.log("✅ User deleted successfully from Firebase")

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
        error: error instanceof Error ? error.message : "Unknown error occurred",
        errorCode: (error as any)?.code || "unknown",
      },
      { status: 500 },
    )
  }
}
