import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { FieldValue } from "firebase-admin/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    const docRef = db.collection("trainers").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const data = doc.data()
    if (!data) {
      return NextResponse.json({ error: "No trainer data found" }, { status: 404 })
    }

    // Return the trainer data with the new schema structure
    return NextResponse.json({
      success: true,
      trainer: {
        id: doc.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        specialty: data.specialty,
        experience: data.experience,
        status: data.status,
        content: data.content || {
          about: { title: "About Me", content: "" },
          hero: { title: "", subtitle: "", description: "" },
          contact: { title: "", description: "", email: "", phone: "", location: "" },
          services: [],
          seo: { title: "", description: "" },
          customization: { lastUpdated: new Date(), version: 1, isDraft: false },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching trainer:", error)
    return NextResponse.json({ error: "Failed to fetch trainer data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    const docRef = db.collection("trainers").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Update the content section with new schema
    const updateData = {
      content: updates.content,
      "content.customization.lastUpdated": FieldValue.serverTimestamp(),
      "content.customization.version": FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await docRef.update(updateData)

    return NextResponse.json({
      success: true,
      message: "Trainer content updated successfully",
    })
  } catch (error) {
    console.error("Error updating trainer:", error)
    return NextResponse.json({ error: "Failed to update trainer content" }, { status: 500 })
  }
}
