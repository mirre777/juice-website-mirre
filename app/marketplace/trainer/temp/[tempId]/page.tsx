import { notFound } from "next/navigation"
import { TrainerService } from "@/lib/firebase-trainer"
import TempTrainerPage from "../TempTrainerPage"
import { logger } from "@/lib/logger"

interface PageProps {
  params: {
    tempId: string
  }
  searchParams: {
    token?: string
  }
}

export default async function TempTrainerPageRoute({ params, searchParams }: PageProps) {
  const { tempId } = params
  const { token } = searchParams

  try {
    logger.info("Loading temp trainer page", {
      tempId,
      hasToken: !!token,
      token: token ? `${token.substring(0, 8)}...` : undefined,
    })

    // Fetch trainer data
    const trainerData = await TrainerService.getTempTrainer(tempId)

    if (!trainerData) {
      logger.warn("Temp trainer not found", { tempId, token })
      notFound()
    }

    logger.info("Successfully loaded temp trainer", {
      tempId,
      email: trainerData.email,
      fullName: trainerData.fullName,
    })

    return <TempTrainerPage trainer={trainerData} tempId={tempId} token={token} />
  } catch (error) {
    logger.error("Error loading temp trainer page", {
      tempId,
      token,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    notFound()
  }
}
