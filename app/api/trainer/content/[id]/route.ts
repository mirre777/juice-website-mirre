import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("=== API TRAINER CONTENT DEBUG ===")
    console.log("1. Received trainer ID:", id)

    if (!id) {
      console.error("2. ERROR: No trainer ID provided")
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    // Check Firebase Admin environment variables
    const hasFirebaseAdmin = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    )

    console.log("3. Firebase Admin config check:", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasFirebaseAdmin,
    })

    if (!hasFirebaseAdmin) {
      console.error("4. ERROR: Firebase Admin not configured")
      return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 })
    }

    // Dynamic import of Firebase Admin to avoid initialization issues
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    // Initialize Firebase Admin
    if (!getApps().length) {
      console.log("5. Initializing Firebase Admin...")
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    }

    const db = getFirestore()
    console.log("6. Firebase Admin initialized successfully")

    console.log("7. Attempting to fetch from Firebase Admin...")
    console.log("8. Collection: trainers, Document ID:", id)

    // Get trainer document from Firebase using Admin SDK
    const trainerDoc = await db.collection("trainers").doc(id).get()
    console.log("9. Firebase Admin query completed")
    console.log("10. Document exists:", trainerDoc.exists)

    if (!trainerDoc.exists) {
      console.error("11. ERROR: Trainer document not found in Firebase")
      console.log("12. Attempted path: trainers/" + id)

      // Let's also try to list some documents to see what's in the collection
      try {
        const trainersRef = db.collection("trainers")
        const snapshot = await trainersRef.limit(5).get()
        console.log("13. Sample documents in trainers collection:")
        snapshot.forEach((doc) => {
          console.log("    - Document ID:", doc.id)
        })
      } catch (listError) {
        console.log("13. Could not list sample documents:", listError)
      }

      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()!
    console.log("14. Trainer data retrieved:", {
      id: trainerData.id || id,
      hasData: !!trainerData,
      keys: Object.keys(trainerData),
      isActive: trainerData.isActive,
      status: trainerData.status,
      fullName: trainerData.fullName,
      email: trainerData.email,
    })

    // Check if trainer is active (either isActive: true OR status: "active")
    const isActive = trainerData.isActive === true || trainerData.status === "active"

    if (!isActive) {
      console.error("15. Trainer is not active:", { isActive: trainerData.isActive, status: trainerData.status })
      return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
    }

    // If trainer has existing content, return it
    if (trainerData.content) {
      console.log("16. Returning existing trainer content")
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
    console.log("17. Generating default content from trainer data")
    const defaultContent = {
      hero: {
        title: `Transform Your Fitness with ${trainerData.fullName || "Professional Training"}`,
        subtitle: `${trainerData.experience || "Experienced"} Personal Trainer specializing in ${trainerData.specialty || trainerData.specialization || "Fitness Training"}`,
        description: `Hi, I'm ${trainerData.fullName || "your trainer"}! With ${trainerData.experience || "years of experience"} in the fitness industry, I specialize in ${trainerData.specialty || trainerData.specialization || "helping clients achieve their fitness goals"}. Located in ${trainerData.location || "your area"}, I'm passionate about helping people transform their lives through fitness.`,
      },
      about: {
        title: "About Me",
        content: `Hi, I'm ${trainerData.fullName || "your trainer"}! With ${trainerData.experience || "years of experience"} in the fitness industry, I specialize in ${trainerData.specialty || trainerData.specialization || "helping clients achieve their fitness goals"}. 

Located in ${trainerData.location || "your area"}, I'm passionate about helping people transform their lives through fitness. Whether you're just starting your fitness journey or looking to take your training to the next level, I'm here to guide and support you every step of the way.

My approach is personalized, results-driven, and focused on creating sustainable habits that last a lifetime.`,
      },
      services: [
        {
          title: "Personal Training Session",
          description: "One-on-one personalized training session focused on your specific goals",
          price: "€60/session",
        },
        {
          title: "Fitness Assessment",
          description: "Comprehensive fitness evaluation and goal-setting session",
          price: "€40/session",
        },
        {
          title: "Custom Workout Plan",
          description: "Personalized workout program designed for your goals and schedule",
          price: "€80/plan",
        },
      ],
      testimonials: [
        {
          name: "Sarah M.",
          text: "Amazing results in just 3 months! Highly recommend.",
          rating: 5,
        },
        {
          name: "Mike R.",
          text: "Professional, knowledgeable, and motivating trainer.",
          rating: 5,
        },
        {
          name: "Lisa K.",
          text: "Helped me achieve my fitness goals beyond expectations.",
          rating: 5,
        },
      ],
      contact: {
        email: trainerData.email || "",
        phone: trainerData.phone || "",
        location: trainerData.location || "",
        availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
      },
    }

    console.log("18. Generated default content successfully")

    return NextResponse.json({
      success: true,
      trainer: {
        id,
        name: trainerData.fullName || trainerData.name || "Personal Trainer",
        fullName: trainerData.fullName || "Personal Trainer",
        email: trainerData.email || "",
        phone: trainerData.phone || "",
        location: trainerData.location || "",
        specialization: trainerData.specialty || trainerData.specialization || "Fitness Training",
        experience: trainerData.experience || "Experienced",
        services: trainerData.services || ["Personal Training"],
        isActive: true,
        status: trainerData.status || "active",
        content: defaultContent,
      },
    })
  } catch (error) {
    console.error("19. CRITICAL ERROR in trainer content API:", error)
    console.error("20. Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Always return JSON, never let it fall through to HTML error page
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trainer content",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
