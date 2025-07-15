import { NextResponse } from "next/server"
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/app/api/firebase-config"

export async function GET() {
  try {
    console.log("Fetching all trainers from Firebase...")

    const trainersRef = collection(db, "trainers")
    const snapshot = await getDocs(trainersRef)

    const trainers: any[] = []
    snapshot.forEach((doc) => {
      trainers.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log(`Found ${trainers.length} trainers`)

    return NextResponse.json({
      success: true,
      count: trainers.length,
      trainers: trainers.map((trainer) => ({
        id: trainer.id,
        fullName: trainer.fullName || trainer.name,
        email: trainer.email,
        location: trainer.location,
        specialty: trainer.specialty || trainer.specialization,
        isActive: trainer.isActive,
        status: trainer.status,
        isPaid: trainer.isPaid,
        hasContent: !!trainer.content,
      })),
    })
  } catch (error) {
    console.error("Error fetching trainers:", error)
    return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, trainerId } = await request.json()

    if (action === "create-test-trainer") {
      const testTrainerId = trainerId || "POj2MRZ5ZRbq3CW1U0zJ"

      const trainerData = {
        id: testTrainerId,
        fullName: "Alex Johnson",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        specialty: "Strength Training",
        specialization: "Strength Training",
        experience: "5+ Years",
        bio: "Certified personal trainer specializing in strength training and functional fitness.",
        services: ["Personal Training", "Strength Coaching", "Fitness Assessment"],
        certifications: ["NASM-CPT", "CSCS"],
        isActive: true,
        status: "active",
        isPaid: true,
        activatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "trainers", testTrainerId), trainerData)

      return NextResponse.json({
        success: true,
        message: "Test trainer created successfully",
        trainerId: testTrainerId,
        url: `/marketplace/trainer/${testTrainerId}`,
      })
    }

    if (action === "delete-trainer" && trainerId) {
      await deleteDoc(doc(db, "trainers", trainerId))

      return NextResponse.json({
        success: true,
        message: "Trainer deleted successfully",
        trainerId,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in trainer debug endpoint:", error)
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}
