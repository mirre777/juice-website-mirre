import { type NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/app/api/firebase-config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log(`[API] Fetching trainer content for ID: ${id}`)

    // Try to get admin database
    const adminDb = await getAdminDb()

    if (!adminDb) {
      console.log("[API] No Firebase Admin config, returning mock data")
      // Return mock data when Firebase Admin is not available
      return NextResponse.json({
        id,
        name: "Alex Johnson",
        specialties: ["Weight Training", "HIIT", "Nutrition Coaching"],
        location: "San Francisco, CA",
        experience: "5+ years",
        bio: "Passionate fitness trainer dedicated to helping clients achieve their health and wellness goals through personalized training programs and nutritional guidance.",
        certifications: [
          "NASM Certified Personal Trainer",
          "Precision Nutrition Level 1",
          "HIIT Specialist Certification",
        ],
        pricing: {
          sessionRate: "$75/hour",
          packageDeals: ["4 sessions: $280 (Save $20)", "8 sessions: $520 (Save $80)", "12 sessions: $720 (Save $180)"],
        },
        availability: ["Mon-Fri: 6AM-8AM", "Mon-Fri: 6PM-8PM", "Sat: 8AM-12PM", "Sun: 10AM-2PM"],
        contact: {
          phone: "(555) 123-4567",
          email: "alex@trainwithme.com",
          website: "https://alexjohnsontraining.com",
          social: {
            instagram: "https://instagram.com/alexjohnsonfit",
            facebook: "https://facebook.com/alexjohnsontraining",
          },
        },
        rating: 4.9,
        reviewCount: 127,
        profileImage: "/placeholder-user.jpg",
        isActive: true,
        status: "active",
      })
    }

    // Try to fetch from Firebase
    try {
      const trainerDoc = await adminDb.collection("trainers").doc(id).get()

      if (!trainerDoc.exists) {
        console.log(`[API] Trainer ${id} not found in database`)
        return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
      }

      const trainerData = trainerDoc.data()
      console.log(`[API] Found trainer data:`, {
        id,
        hasContent: !!trainerData?.content,
        isActive: trainerData?.isActive,
        status: trainerData?.status,
      })

      // Check if trainer is active
      const isActive = trainerData?.isActive === true || trainerData?.status === "active"

      if (!isActive) {
        console.log(`[API] Trainer ${id} is not active`)
        return NextResponse.json({ error: "Trainer profile is not active" }, { status: 403 })
      }

      // Get content or generate default
      let content = trainerData?.content

      if (!content) {
        console.log(`[API] No content found for trainer ${id}, generating default`)
        content = {
          name: trainerData?.name || "Professional Trainer",
          specialties: trainerData?.specialties || ["Personal Training", "Fitness Coaching"],
          location: trainerData?.location || "Location TBD",
          experience: trainerData?.experience || "Experienced Professional",
          bio: trainerData?.bio || "Dedicated fitness professional committed to helping you achieve your goals.",
          certifications: trainerData?.certifications || ["Certified Personal Trainer"],
          pricing: trainerData?.pricing || {
            sessionRate: "$60/hour",
            packageDeals: ["Contact for package deals"],
          },
          availability: trainerData?.availability || ["Contact for availability"],
          contact: trainerData?.contact || {
            email: "contact@trainer.com",
          },
          rating: 5.0,
          reviewCount: 0,
          profileImage: "/placeholder-user.jpg",
        }
      }

      return NextResponse.json({
        id,
        ...content,
        isActive: true,
        status: "active",
      })
    } catch (dbError) {
      console.error(`[API] Database error for trainer ${id}:`, dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
