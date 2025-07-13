import { notFound } from "next/navigation"
import TempTrainerPage from "./TempTrainerPage"

interface PageProps {
  params: {
    tempId: string
  }
}

export default function Page({ params }: PageProps) {
  const { tempId } = params

  if (!tempId) {
    notFound()
  }

  return <TempTrainerPage tempId={tempId} />
}
