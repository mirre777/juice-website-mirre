import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"

export async function GET(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params

    // Get trainer document
    const trainerDoc = await db.collection("trainers").doc(tempId).get()

    if (!trainerDoc.exists) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()

    // Return trainer data regardless of status (let page controller handle redirect)
    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerDoc.id,
        ...trainerData,
      },
      content: trainerData?.content || null,
    })
  } catch (error) {
    console.error("Error fetching temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trainer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tempId: string } }) {
  try {
    const { tempId } = params
    const { content } = await request.json()

    // Get current trainer status
    const trainerDoc = await db.collection("trainers").doc(tempId).get()

    if (!trainerDoc.exists) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()

    // If trainer is activated, they should use live trainer endpoint
    if (trainerData?.status === "active" && trainerData?.isPaid) {
      console.log(`Trainer ${tempId} is already activated, suggesting redirect`)
      return NextResponse.json(
        {
          success: false,
          error: "Trainer already activated",
          redirectTo: `/marketplace/trainer/${tempId}`,
        },
        { status: 400 },
      )
    }

    // Update temp trainer content
    await db.collection("trainers").doc(tempId).update({
      content: content,
      updatedAt: new Date().toISOString(),
    })

    console.log(`Successfully updated content for temp trainer ${tempId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating temp trainer:", error)
    return NextResponse.json({ success: false, error: "Failed to update trainer content" }, { status: 500 })
  }
}
