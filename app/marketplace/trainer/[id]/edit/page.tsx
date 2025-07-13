import { notFound } from "next/navigation"
import { TrainerContentEditor } from "./TrainerContentEditor"

interface PageProps {
  params: {
    id: string
  }
}

export default async function TrainerEditPage({ params }: PageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerContentEditor trainerId={id} />
    </div>
  )
}
