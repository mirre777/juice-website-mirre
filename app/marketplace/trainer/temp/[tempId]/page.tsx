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
    const trainer = await TrainerService.getTempTrainer(tempId)

    if (!trainer) {
      notFound()
    }

    return <TempTrainerPage trainer={trainer} />
  } catch (error) {
    console.error("Error loading temp trainer:", error)
    notFound()
  }
}
