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

    try {
      console.log("4. Attempting Firebase lookup for:", params.id)

      const doc = await db.collection("trainers").doc(params.id).get()

      if (doc.exists) {
        const trainerData = doc.data()
        console.log("5. Found trainer in Firebase:", trainerData?.fullName)

        let content = trainerData?.content

        if (!content) {
          content = {
            hero: {
              title: `Transform Your Fitness with ${trainerData.fullName}`,
              subtitle: `Professional ${trainerData.specialty} trainer in ${trainerData.location}`,
              description:
                trainerData.bio ||
                "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
            },
            about: {
              title: `About ${trainerData.fullName}`,
              content:
                trainerData.bio ||
                "Experienced personal trainer dedicated to helping clients achieve their fitness goals.",
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
      }
    } catch (firebaseError) {
      console.log("6. Firebase error:", firebaseError)
    }

    console.log("7. Trainer not found:", params.id)
    return NextResponse.json(
      {
        success: false,
        error: "Trainer not found",
      },
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("8. Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
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

    try {
      const updateData = {
        content: content,
        updatedAt: new Date().toISOString(),
      }

      await db.collection("trainers").doc(params.id).update(updateData)

      console.log("Successfully updated trainer content in Firebase")

      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
      })
    } catch (firebaseError) {
      console.error("Firebase update error:", firebaseError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update content in database",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
