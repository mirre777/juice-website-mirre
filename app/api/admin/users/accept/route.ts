import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { doc, updateDoc } from "firebase-admin/firestore"

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 500 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userRef = doc(db, "potential_users", userId)
    await updateDoc(userRef, {
      status: "pending",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
