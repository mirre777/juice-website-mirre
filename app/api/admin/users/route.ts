import { NextResponse } from "next/server"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/firebase"

export async function GET() {
  try {
    const waitlistRef = collection(db, "waitlist")
    const q = query(waitlistRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        user_type: data.user_type || "client",
        city: data.city || "",
        district: data.district || "",
        goal: data.goal || "",
        startTime: data.startTime || "",
        phone: data.phone || "",
        message: data.message || "",
        numClients: data.numClients || "",
        plan: data.plan || "",
        source: data.source || "unknown",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
