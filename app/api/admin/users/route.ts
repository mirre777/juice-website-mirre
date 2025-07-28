import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/firebase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching users from potential_users collection...")

    // Query the potential_users collection
    const usersRef = collection(db, "potential_users")
    const q = query(usersRef, orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email || "N/A",
        phone: data.phone || "N/A",
        city: data.city || "N/A",
        user_type: data.user_type || "N/A",
        status: data.status || "waitlist",
        created_at: data.created_at?.toDate?.()?.toLocaleDateString() || "N/A",
        numClients: data.numClients || null,
      }
    })

    console.log(`Found ${users.length} users`)

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
