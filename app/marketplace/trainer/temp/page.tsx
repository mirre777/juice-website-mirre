import { redirect } from "next/navigation"
import TempTrainerPage from "./TempTrainerPage"

interface PageProps {
  params: {
    tempId: string
  }
}

export default function Page({ params }: PageProps) {
  const { tempId } = params

  if (!tempId) {
    redirect("/marketplace")
  }

  return <TempTrainerPage tempId={tempId} />
}
