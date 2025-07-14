import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting Firebase debug test...")

    // Test 1: Check if Firebase is initialized
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: "Firebase not initialized",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    console.log("✅ Firebase initialized successfully")

    // Test 2: Try to access trainers collection
    const trainersRef = collection(db, "trainers")
    console.log("📁 Accessing trainers collection...")

    // Test 3: Get all trainers
    const snapshot = await getDocs(trainersRef)
    console.log(`📊 Found ${snapshot.size} trainer documents`)

    const trainers = []
    snapshot.forEach((doc) => {
      trainers.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    // Test 4: Test specific trainer access if ID provided
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get("testId")

    let specificTrainer = null
    if (testId) {
      console.log(`🎯 Testing specific trainer: ${testId}`)
      const trainerDoc = await getDoc(doc(db, "trainers", testId))
      if (trainerDoc.exists()) {
        specificTrainer = {
          id: trainerDoc.id,
          data: trainerDoc.data(),
        }
        console.log("✅ Specific trainer found")
      } else {
        console.log("❌ Specific trainer not found")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Firebase connection successful",
      data: {
        totalTrainers: snapshot.size,
        trainers: trainers.slice(0, 3), // Only return first 3 for brevity
        specificTrainer,
        testId,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Firebase debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
