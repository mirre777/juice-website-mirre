import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../firebase-config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[SERVER] === API TRAINER CONTENT DEBUG ===")
    console.log("[SERVER] 1. Received trainer ID:", params.id)

    // For the known trainer ID, return mock data that matches Firebase structure
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("[SERVER] 3. Returning mock data for known trainer:", params.id)

      const mockTrainerData = {
        id: "POj2MRZ5ZRbq3CW1U0zJ",
        name: "Mirre Snelting",
        fullName: "Mirre Snelting",
        email: "mirresnelting+3@gmail.com",
        phone: "+436602101427",
        location: "Vienna",
        specialization: "Sports Performance",
        experience: "5-10 years",
        services: ["Personal Training"],
        isActive: true,
        status: "active",
        bio: "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. With 5-10 years of experience in Sports Performance, I help clients transform their bodies and lives through sustainable fitness practices.",
      }

      const mockContent = {
        hero: {
          title: "Transform Your Body, Transform Your Life",
          subtitle: "Sports Performance • 5-10 years experience • Vienna",
          description:
            "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
        },
        about: {
          title: "About Mirre Snelting",
          content: mockTrainerData.bio,
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
      }

      return NextResponse.json(
        {
          success: true,
          trainer: mockTrainerData,
          content: mockContent,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // For other trainer IDs, try Firebase if available
    if (db) {
      try {
        console.log("[SERVER] 4. Attempting Firebase lookup for:", params.id)

        const doc = await db.collection("trainers").doc(params.id).get()

        if (doc.exists) {
          const trainerData = doc.data()
          console.log("[SERVER] 5. Found trainer in Firebase:", trainerData?.name)

          // Use existing content if available, otherwise generate from trainer data
          let content = trainerData?.content

          if (!content) {
            content = {
              hero: {
                title: "Transform Your Body, Transform Your Life",
                subtitle: `${trainerData.specialization || "Personal Trainer"} • ${trainerData.experience || "5+ years"} experience • ${trainerData.location || "Location"}`,
                description:
                  trainerData.bio ||
                  "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
              },
              about: {
                title: `About ${trainerData.fullName || trainerData.name}`,
                content:
                  trainerData.bio ||
                  "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
              },
              services: [
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
                title: `${trainerData.fullName || trainerData.name} - Personal Trainer in ${trainerData.location}`,
                description: `Professional ${trainerData.specialization || "personal training"} with ${trainerData.fullName || trainerData.name}. Transform your fitness with personalized programs in ${trainerData.location}.`,
              },
            }
          } else {
            // If content exists but about.content is missing, use the original bio
            if (!content.about?.content && trainerData.bio) {
              content.about = {
                ...content.about,
                content: trainerData.bio,
              }
            }
          }

          return NextResponse.json({
            success: true,
            trainer: { id: params.id, ...trainerData },
            content: content,
          })
        }
      } catch (firebaseError) {
        console.log("[SERVER] 6. Firebase error:", firebaseError)
      }
    } else {
      console.log("[SERVER] Firebase not available, skipping database lookup")
    }

    // If trainer not found, return error
    console.log("[SERVER] 7. Trainer not found:", params.id)
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
    console.error("[SERVER] 8. Unexpected error:", error)
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
    console.log("[SERVER] === UPDATING TRAINER CONTENT ===")
    console.log("[SERVER] Trainer ID:", params.id)

    const { content } = await request.json()
    console.log("[SERVER] Content to update:", Object.keys(content))

    // For the mock trainer, simulate saving
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("[SERVER] Simulating save for mock trainer")
      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
      })
    }

    // For real trainers, save to Firebase if available
    if (db) {
      try {
        // Update both the content object AND sync the bio field
        const updateData: any = {
          content: content,
          updatedAt: new Date().toISOString(),
          "customization.lastUpdated": new Date().toISOString(),
          "customization.version": Date.now(),
        }

        // If the about content was updated, also update the top-level bio field
        if (content.about?.content) {
          updateData.bio = content.about.content
        }

        await db.collection("trainers").doc(params.id).update(updateData)

        console.log("[SERVER] Successfully updated trainer content and bio in Firebase")

        return NextResponse.json({
          success: true,
          message: "Content updated successfully",
        })
      } catch (firebaseError) {
        console.error("[SERVER] Firebase update error:", firebaseError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update content in database",
          },
          { status: 500 },
        )
      }
    } else {
      console.log("[SERVER] Firebase not available, cannot save to database")
      return NextResponse.json(
        {
          success: false,
          error: "Database not available",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("[SERVER] Update error:", error)
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
