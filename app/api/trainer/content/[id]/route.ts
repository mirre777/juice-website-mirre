import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  console.log("GET /api/trainer/content/[id] - Fetching trainer content for ID:", id)

  try {
    if (!id) {
      console.error("No trainer ID provided")
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    // Get the trainer document
    const trainerRef = db.collection("trainers").doc(id)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      console.error("Trainer not found:", id)
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()
    console.log("Trainer data found:", { id, name: trainerData?.name, status: trainerData?.status })

    // Get the content document if it exists
    const contentRef = db.collection("trainer_content").doc(id)
    const contentDoc = await contentRef.get()

    let contentData = null
    if (contentDoc.exists) {
      contentData = contentDoc.data()
      console.log("Content data found for trainer:", id)
    } else {
      console.log("No content data found for trainer:", id)
    }

    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerDoc.id,
        ...trainerData,
        createdAt: trainerData?.createdAt?.toDate?.()?.toISOString() || trainerData?.createdAt,
      },
      content: contentData,
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trainer data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  console.log("PUT /api/trainer/content/[id] - Updating trainer content for ID:", id)

  try {
    if (!id) {
      console.error("No trainer ID provided")
      return NextResponse.json({ success: false, error: "Missing trainer ID" }, { status: 400 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      console.error("No content provided")
      return NextResponse.json({ success: false, error: "Missing content data" }, { status: 400 })
    }

    // Verify trainer exists
    const trainerRef = db.collection("trainers").doc(id)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      console.error("Trainer not found:", id)
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    // Save content
    const contentRef = db.collection("trainer_content").doc(id)
    await contentRef.set(
      {
        ...content,
        trainerId: id,
        updatedAt: new Date(),
      },
      { merge: true },
    )

    console.log("Content updated successfully for trainer:", id)

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Error updating trainer content:", error)
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 })
  }
}
