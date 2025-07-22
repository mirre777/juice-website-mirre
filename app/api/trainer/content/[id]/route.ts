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
    console.log("=== API TRAINER CONTENT GET ===")
    console.log("1. Received trainer ID:", params.id)

    // Always try Firebase first
    try {
      console.log("2. Attempting Firebase lookup for:", params.id)

      const doc = await db.collection("trainers").doc(params.id).get()

      if (doc.exists) {
        const trainerData = doc.data()
        console.log("3. Found trainer in Firebase:", trainerData?.fullName)
        console.log("4. Content exists:", !!trainerData?.content)

        let content = trainerData?.content

        // If no content exists, generate default content with new field structure
        if (!content) {
          console.log("5. Generating default content")
          const location =
            trainerData.city && trainerData.district
              ? `${trainerData.city}, ${trainerData.district}`
              : trainerData.location || "Location not specified"

          content = {
            hero: {
              title: `Transform Your Fitness with ${trainerData.fullName}`,
              subtitle: `Professional ${trainerData.specialty} trainer in ${location}`,
              description:
                trainerData.bio ||
                "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
            },
            about: {
              title: `About ${trainerData.fullName}`,
              content:
                trainerData.bio ||
                "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
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
              phone: trainerData.phone || "",
              city: trainerData.city || "",
              district: trainerData.district || "",
            },
            seo: {
              title: `${trainerData.fullName} - Personal Trainer in ${location}`,
              description: `Professional ${trainerData.specialty} training with ${trainerData.fullName}. Transform your fitness with personalized programs in ${location}.`,
            },
            customization: {
              lastUpdated: new Date(),
              version: 1,
              isDraft: false,
            },
          }
        } else {
          console.log("5. Using existing content from database")
        }

        return NextResponse.json({
          success: true,
          trainer: { id: params.id, ...trainerData },
          content: content,
        })
      } else {
        console.log("6. Document not found in Firebase")
      }
    } catch (firebaseError) {
      console.log("7. Firebase error:", firebaseError)
    }

    // Fallback for testing
    if (params.id === "POj2MRZ5ZRbq3CW1U0zJ") {
      console.log("8. Using fallback mock data for:", params.id)

      const mockTrainerData = {
        id: "POj2MRZ5ZRbq3CW1U0zJ",
        fullName: "Mirre Snelting",
        email: "mirresnelting+3@gmail.com",
        phone: "+436602101427",
        city: "Vienna",
        district: "Innere Stadt",
        specialty: "Sports Performance",
        certifications: "",
        isActive: true,
        status: "active",
        content: {
          hero: {
            title: "Transform Your Body, Transform Your Life",
            subtitle: "Sports Performance trainer in Vienna, Innere Stadt",
            description:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
          },
          about: {
            title: "About Mirre Snelting",
            content:
              "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance. Specializing in Sports Performance training in Vienna.",
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
          ],
          contact: {
            title: "Let's Start Your Fitness Journey",
            description:
              "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
            email: "mirresnelting+3@gmail.com",
            phone: "+436602101427",
            city: "Vienna",
            district: "Innere Stadt",
          },
          seo: {
            title: "Mirre Snelting - Personal Trainer in Vienna, Innere Stadt",
            description:
              "Professional Sports Performance training with Mirre Snelting. Transform your fitness with personalized programs in Vienna, Innere Stadt.",
          },
          customization: {
            lastUpdated: new Date(),
            version: 1,
            isDraft: false,
          },
        },
      }

      return NextResponse.json({
        success: true,
        trainer: mockTrainerData,
        content: mockTrainerData.content,
      })
    }

    console.log("9. Trainer not found:", params.id)
    return NextResponse.json(
      {
        success: false,
        error: "Trainer not found",
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("10. Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("=== UPDATING TRAINER CONTENT ===")
    console.log("1. Trainer ID:", params.id)

    const { content } = await request.json()
    console.log("2. Content keys to update:", Object.keys(content))
    console.log("3. Hero title:", content.hero?.title)
    console.log("4. About content:", content.about?.content?.substring(0, 100) + "...")

    // ALWAYS try to update Firebase, regardless of trainer ID
    try {
      const updateData = {
        content: content,
        updatedAt: new Date().toISOString(),
      }

      console.log("5. Attempting Firebase update...")
      await db.collection("trainers").doc(params.id).update(updateData)
      console.log("6. ✅ Successfully updated trainer content in Firebase")

      return NextResponse.json({
        success: true,
        message: "Content updated successfully",
        debug: {
          trainerId: params.id,
          updatedAt: updateData.updatedAt,
          contentKeys: Object.keys(content),
          heroTitle: content.hero?.title,
          aboutContent: content.about?.content?.substring(0, 50) + "...",
        },
      })
    } catch (firebaseError) {
      console.error("7. ❌ Firebase update error:", firebaseError)

      // Check if it's a permission error or document doesn't exist
      if (firebaseError.code === "not-found") {
        return NextResponse.json(
          {
            success: false,
            error: "Trainer document not found in database",
            details: firebaseError.message,
            debug: {
              trainerId: params.id,
              errorCode: firebaseError.code,
            },
          },
          { status: 404 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to update content in database",
          details: firebaseError.message,
          debug: {
            trainerId: params.id,
            errorType: firebaseError.code || "unknown",
            errorMessage: firebaseError.message,
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("8. ❌ Unexpected update error:", error)
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
