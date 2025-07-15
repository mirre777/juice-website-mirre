import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("Fetching trainer content for ID:", id)

    if (!id) {
      console.error("No trainer ID provided")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Get trainer document from Firebase
    const trainerRef = doc(db, "trainers", id)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      console.error("Trainer document not found:", id)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()
    console.log("Trainer data found:", {
      id,
      isActive: trainerData.isActive,
      status: trainerData.status,
      hasContent: !!trainerData.content,
    })

    // Check if trainer is active (either isActive: true OR status: "active")
    const isActive = trainerData.isActive === true || trainerData.status === "active"

    if (!isActive) {
      console.error("Trainer is not active:", { isActive: trainerData.isActive, status: trainerData.status })
      return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
    }

    // If trainer has existing content, return it
    if (trainerData.content) {
      console.log("Returning existing trainer content")
      return NextResponse.json({
        success: true,
        trainer: {
          id,
          ...trainerData,
          content: trainerData.content,
        },
      })
    }

    // Generate default content from trainer's form data
    console.log("Generating default content from trainer data")
    const defaultContent = {
      hero: {
        title: `Transform Your Fitness with ${trainerData.fullName || "Professional Training"}`,
        subtitle: `${trainerData.experience || "Experienced"} Personal Trainer specializing in ${trainerData.specialty || trainerData.specialization || "Fitness Training"}`,
        cta: "Book Your Session",
        backgroundImage: "/images/lemon-trainer.png",
      },
      about: {
        title: "About Me",
        content: `Hi, I'm ${trainerData.fullName || "your trainer"}! With ${trainerData.experience || "years of experience"} in the fitness industry, I specialize in ${trainerData.specialty || trainerData.specialization || "helping clients achieve their fitness goals"}. 

Located in ${trainerData.location || "your area"}, I'm passionate about helping people transform their lives through fitness. Whether you're just starting your fitness journey or looking to take your training to the next level, I'm here to guide and support you every step of the way.

My approach is personalized, results-driven, and focused on creating sustainable habits that last a lifetime.`,
        image: "/images/lemon-trainer-serious.png",
      },
      services: {
        title: "My Services",
        items: trainerData.services || ["Personal Training", "Fitness Coaching", "Workout Planning"],
      },
      contact: {
        title: "Get In Touch",
        phone: trainerData.phone || "",
        email: trainerData.email || "",
        location: trainerData.location || "",
        cta: "Contact Me Today",
      },
      seo: {
        title: `${trainerData.fullName || "Personal Trainer"} - ${trainerData.location || "Fitness Training"}`,
        description: `Professional personal trainer specializing in ${trainerData.specialty || trainerData.specialization || "fitness training"}. Located in ${trainerData.location || "your area"}. Book your session today!`,
        keywords: `personal trainer, fitness coach, ${trainerData.location || ""}, ${trainerData.specialty || trainerData.specialization || "fitness training"}`,
      },
    }

    console.log("Generated default content successfully")

    return NextResponse.json({
      success: true,
      trainer: {
        id,
        fullName: trainerData.fullName || "Personal Trainer",
        email: trainerData.email || "",
        phone: trainerData.phone || "",
        location: trainerData.location || "",
        specialty: trainerData.specialty || trainerData.specialization || "Fitness Training",
        experience: trainerData.experience || "Experienced",
        services: trainerData.services || ["Personal Training"],
        isActive: true,
        status: trainerData.status || "active",
        content: defaultContent,
      },
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}
