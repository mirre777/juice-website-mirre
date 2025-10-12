import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseClientDb, isBuildTime } from "@/lib/firebase-global-guard"

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  if (isBuildTime()) {
    return NextResponse.json({ error: "Route not available during build time" }, { status: 503 })
  }

  console.log("[v0] 📥 RELAY POTENTIAL USER FETCH API CALLED")
  console.log("[v0] 🕐 Timestamp:", new Date().toISOString())
  console.log("[v0] 📊 Document ID:", params.documentId)

  try {
    const db = await getFirebaseClientDb()

    if (!params.documentId) {
      console.error("[v0] ❌ Document ID is required")
      return NextResponse.json(
        {
          success: false,
          error: "Document ID is required",
        },
        { status: 400 },
      )
    }

    console.log("[v0] 🔄 Fetching user from potential_users collection...")

    const { doc, getDoc } = await import("firebase/firestore")
    const userRef = doc(db, "potential_users", params.documentId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      console.error("[v0] ❌ User not found")
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    const userData = userSnap.data()
    console.log("[v0] ✅ User fetched successfully")

    // Return the full user data with all fields
    return NextResponse.json({
      success: true,
      data: {
        documentId: params.documentId,
        email: userData.email || "",
        city: userData.city || "",
        userType: userData.user_type || "",
        plan: userData.plan || "",
        phone: userData.phone || "",
        name: userData.name || "",
        goal: userData.goal || "",
        district: userData.district || "",
        startTime: userData.startTime || "",
        source: userData.source || "",
        createdAt: userData.createdAt || "",
        status: userData.status || "pending",
      },
    })
  } catch (error) {
    console.error("[v0] ❌ Error fetching user:", error)
    console.error("[v0] 🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      },
      { status: 500 },
    )
  }
}
