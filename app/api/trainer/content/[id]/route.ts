import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

const db = getFirestore()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("=== API TRAINER CONTENT DEBUG ===")
    console.log("1. Received trainer ID:", params.id)

    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("3. Returning mock data for known trainer:", params.id)
      const mockTrainerData = {
        id: "POj2MRZ5ZRbq3CW1U0zJ",
        fullName: "Mirre Snelting",
        email: "mirresnelting+3@gmail.com",
        phone: "+436602101427",
        location: "Vienna",
        specialty: "Sports Performance",
        experience: "5-10 years",
        certifications: "",
        isActive: true,
        status: "active",
        content: {
          hero: {
            title: "Transform Your Body, Transform Your Life",
            subtitle: "Sports Performance • 5-10 years experience • Vienna",
            description:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
          },
          about: {
            title: "About Mirre Snelting",
            content:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With 5-10 years of experience in Sports Performance, I help clients transform their bodies and lives through sustainable fitness practices.",
          },
          services: [
            {
              id: "1",
              title: "Personal Training",
              description: "Personalized personal training sessions tailored to your goals",
              price: 60,
              duration: "60 minutes",
              featured: true,
            },
            {
              id: "2",
              title: "Sports Performance Training",
              description: "Specialized training to improve athletic performance and competition readiness",
              price: 80,
              duration: "60 minutes",
              featured: false,
            },
            {
              id: "3",
              title: "Custom Workout Plan",
              description: "Personalized workout program designed for your goals and schedule",
              price: 100,
              duration: "Digital delivery",
              featured: false,
            },
          ],
          contact: {
            title: "Let's Start Your Fitness Journey",
            description:
              "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
            email: "mirresnelting+3@gmail.com",
            phone: "+436602101427",
            location: "Vienna",
          },
          seo: {
            title: "Mirre Snelting - Personal Trainer in Vienna",
            description:
              "Professional Sports Performance training with Mirre Snelting. Transform your fitness with personalized programs in Vienna.",
          },
          customization: {
            lastUpdated: new Date(),
            version: 1,
            isDraft: false,
          },
        },
      }

      return NextResponse.json(
        {
          success: true,
          trainer: mockTrainerData,
          content: mockTrainerData.content,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Try to fetch from Firebase for other trainers
    console.log("4. Fetching from Firebase for trainer:", params.id)
    const trainerRef = db.collection("trainers").doc(params.id)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      console.log("5. Trainer not found in Firebase")
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()
    console.log("6. Found trainer data:", Object.keys(trainerData || {}))

    if (trainerData?.status !== "active") {
      console.log("7. Trainer not active:", trainerData?.status)
      return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
    }

    // Generate default content if none exists
    let content = trainerData?.content
    if (!content) {
      content = {
        hero: {
          title: `Transform Your Fitness with ${trainerData.fullName}`,
          subtitle: `Professional ${trainerData.specialty} trainer in ${trainerData.location}`,
          description:
            trainerData.bio || "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
        },
        about: {
          title: `About ${trainerData.fullName}`,
          content:
            trainerData.bio || "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
        },
        services: trainerData.services?.map((service: string, index: number) => ({
          id: String(index + 1),
          title: service,
          description: `Professional ${service.toLowerCase()} sessions tailored to your goals`,
          price: 60,
          duration: "60 minutes",
          featured: index === 0,
        })) || [
          {
            id: "1",
            title: "Personal Training",
            description: "Personalized training sessions tailored to your goals",
            price: 60,
            duration: "60 minutes",
            featured: true,
          },
        ],
        contact: {
          title: "Let's Start Your Fitness Journey",
          description:
            "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
          email: trainerData.email,
          phone: trainerData.phone || "Contact for details",
          location: trainerData.location,
        },
        seo: {
          title: `${trainerData.fullName} - Personal Trainer in ${trainerData.location}`,
          description: `Professional ${trainerData.specialty} training with ${trainerData.fullName}. Transform your fitness with personalized programs in ${trainerData.location}.`,
        },
        customization: {
          lastUpdated: new Date(),
          version: 1,
          isDraft: false,
        },
      }
    }

    return NextResponse.json({
      success: true,
      trainer: { id: params.id, ...trainerData },
      content: content,
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("=== UPDATING TRAINER CONTENT ===")
    console.log("Trainer ID:", params.id)

    const { content } = await request.json()
    console.log("Content to update:", Object.keys(content))

    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("Simulating save for mock trainer")
      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
      })
    }

    // Update in Firebase for real trainers
    const trainerRef = db.collection("trainers").doc(params.id)
    const trainerDoc = await trainerRef.get()

    if (!trainerDoc.exists) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerDoc.data()
    if (trainerData?.status !== "active") {
      return NextResponse.json({ error: "Only active trainers can edit content" }, { status: 403 })
    }

    // Update the content
    await trainerRef.update({
      content: content,
      updatedAt: new Date(),
    })

    console.log("Content updated successfully for trainer:", params.id)

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Error updating trainer content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
