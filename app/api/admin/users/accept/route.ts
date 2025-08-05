import { type NextRequest, NextResponse } from "next/server"
import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: NextRequest) {
  console.log("📞 CONTACTED USER API CALLED")
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

    console.log("🔥 Updating user status from waitlist to contacted...")

    // Update the user status from "waitlist" to "contacted"
    const userRef = doc(db, "potential_users", userId)
    await updateDoc(userRef, {
      status: "contacted",
      contactedAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("✅ User status updated successfully to 'contacted'")

    return NextResponse.json({
      success: true,
      message: "User marked as contacted successfully",
      userId: userId,
    })
  } catch (error) {
    console.error("❌ Error updating user status:", error)
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
