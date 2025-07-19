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
    logger.info("=== TEMP TRAINER PAGE LOADING ===", {
      tempId,
      hasToken: !!token,
      token: token ? `${token.substring(0, 8)}...` : undefined,
    })

    if (!tempId) {
      logger.error("No tempId provided to page")
      notFound()
    }

    // Fetch trainer data
    const trainerData = await TrainerService.getTempTrainer(tempId)

    if (!trainerData) {
      logger.warn("Temp trainer not found for page", { tempId, token })
      notFound()
    }

    logger.info("Successfully loaded temp trainer for page", {
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
      stack: error instanceof Error ? error.stack : undefined,
    })
    notFound()
  }
}

export async function generateMetadata({ params }: { params: { tempId: string } }) {
  try {
    const trainer = await TrainerService.getTempTrainer(params.tempId)

    if (!trainer) {
      return {
        title: "Trainer Not Found",
      }
    }

    return {
      title: `${trainer.fullName} - Trainer Preview`,
      description: `Preview of ${trainer.fullName}'s trainer website - ${trainer.specialty} specialist in ${trainer.location}`,
    }
  } catch (error) {
    return {
      title: "Trainer Preview",
    }
  }
}
