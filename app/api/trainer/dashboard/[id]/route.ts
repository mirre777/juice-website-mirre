import { type NextRequest, NextResponse } from "next/server"
import { TrainerService } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id

    logger.info("Fetching trainer dashboard data", { trainerId })

    // Get trainer dashboard data
    const dashboardData = await TrainerService.getTrainerDashboardData(trainerId)

    if (!dashboardData) {
      logger.warn("Trainer not found for dashboard", { trainerId })
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    // Check if trainer is active
    if (!dashboardData.isActive) {
      logger.warn("Attempted to access dashboard for inactive trainer", { trainerId })
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    logger.info("Successfully fetched trainer dashboard data", {
      trainerId,
      isContentComplete: dashboardData.isContentComplete,
    })

    return NextResponse.json(dashboardData)
  } catch (error) {
    logger.apiError("/api/trainer/dashboard/[id]", "GET", error, {
      trainerId: params.id,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
