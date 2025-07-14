import { NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.info("Testing Firebase connection for temp trainers")

    // Test basic Firebase connection
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    // Try to fetch some trainer documents
    const trainersRef = collection(db, "trainers")
    const q = query(trainersRef, limit(5))
    const snapshot = await getDocs(q)

    const trainers = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))

    logger.info("Firebase connection test successful", {
      trainerCount: trainers.length,
      sampleTrainerIds: trainers.map((t) => t.id),
    })

    return NextResponse.json({
      success: true,
      message: "Firebase connection working",
      trainerCount: trainers.length,
      sampleTrainers: trainers.map((trainer) => ({
        id: trainer.id,
        email: trainer.data.email,
        fullName: trainer.data.fullName,
        hasSessionToken: !!trainer.data.sessionToken,
        hasExpiresAt: !!trainer.data.expiresAt,
        isActive: trainer.data.isActive,
        isPaid: trainer.data.isPaid,
      })),
    })
  } catch (error) {
    logger.error("Firebase connection test failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Firebase connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
