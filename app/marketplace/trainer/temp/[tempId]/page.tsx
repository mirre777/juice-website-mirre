import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

async function getTrainerData(tempId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/trainer/temp/${tempId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.trainer : null
  } catch (error) {
    console.error("Error fetching trainer data:", error)
    return null
  }
}

export default async function TempTrainerPageWrapper({ params, searchParams }: PageProps) {
  const { tempId } = params
  const { token } = searchParams

  if (!tempId) {
    notFound()
  }

  const trainer = await getTrainerData(tempId)

  if (!trainer) {
    notFound()
  }

  return <TempTrainerPage trainer={trainer} token={token} />
}

export async function generateMetadata({ params }: { params: { tempId: string } }) {
  const trainer = await getTrainerData(params.tempId)

  if (!trainer) {
    return {
      title: "Trainer Not Found",
    }
  }

  return {
    title: `${trainer.fullName} - Trainer Preview`,
    description: `Preview of ${trainer.fullName}'s trainer website - ${trainer.specialty} specialist in ${trainer.location}`,
  }
}
