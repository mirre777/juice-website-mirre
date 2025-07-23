import { TrainerService } from "@/lib/firebase-trainer"
import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: {
    tempId: string
  }
}

export default async function TempTrainerPageWrapper({ params }: PageProps) {
  const { tempId } = params

  try {
    console.log(`[TempTrainerPageWrapper] Loading temp trainer: ${tempId}`)

    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      console.log(`[TempTrainerPageWrapper] Trainer not found: ${tempId}`)
      notFound()
    }

    console.log(`[TempTrainerPageWrapper] Trainer loaded successfully:`, {
      tempId: trainer.tempId,
      fullName: trainer.fullName,
      createdAt: trainer.createdAt,
    })

    return <TempTrainerPage trainer={trainer} />
  } catch (error) {
    console.error(`[TempTrainerPageWrapper] Error loading temp trainer ${tempId}:`, error)
    notFound()
  }
}
