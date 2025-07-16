import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { collection, getDocs } from "firebase-admin/firestore"

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 500 })
    }

    const usersCollection = collection(db, "potential_users")
    const userSnapshot = await getDocs(usersCollection)

    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      user_type: doc.data().user_type,
      status: doc.data().status,
      created_at: doc.data().created_at?.toDate?.()?.toLocaleString() || "Unknown",
      numClients: doc.data().numClients || "N/A",
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
