import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

async function getTrainerData(tempId: string, token?: string) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trainer/temp/${tempId}`)
    if (token) {
      url.searchParams.set("token", token)
    }

    const response = await fetch(url.toString(), {
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

  const trainer = await getTrainerData(tempId, token)

  if (!trainer) {
    notFound()
  }

  return <TempTrainerPage trainer={trainer} />
}
