import { notFound } from "next/navigation"
import TrainerContentEditor from "./TrainerContentEditor"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditTrainerPage({ params }: PageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return <TrainerContentEditor trainerId={id} />
}
