import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

async function fetchTempTrainer(tempId: string, token?: string) {
  console.log("fetchTempTrainer called with:", { tempId, hasToken: !!token })

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const url = new URL(`/api/trainer/temp/${tempId}`, baseUrl)

    if (token) {
      url.searchParams.set("token", token)
    }

    console.log("Fetching from URL:", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API response error:", { status: response.status, error: errorText })

      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("API response data:", { success: data.success, hasTrainer: !!data.trainer })

    if (!data.success || !data.trainer) {
      console.error("Invalid API response:", data)
      return null
    }

    return data.trainer
  } catch (error) {
    console.error("Error in fetchTempTrainer:", {
      tempId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}

export default async function TempTrainerPageWrapper({ params, searchParams }: PageProps) {
  const { tempId } = params
  const { token } = searchParams

  console.log("TempTrainerPageWrapper called with:", { tempId, token })

  try {
    const trainer = await fetchTempTrainer(tempId, token)

    if (!trainer) {
      console.error("Trainer not found, calling notFound()")
      notFound()
    }

    console.log("Rendering TempTrainerPage with trainer:", { id: trainer.id, name: trainer.name })

    return <TempTrainerPage trainer={trainer} token={token} />
  } catch (error) {
    console.error("Error in TempTrainerPageWrapper:", error)
    notFound()
  }
}
