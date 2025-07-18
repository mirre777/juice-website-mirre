import { Suspense } from "react"
import TempTrainerPage from "../TempTrainerPage"
import { db } from "../../../../api/firebase-config"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

async function getTrainerData(tempId: string) {
  try {
    if (!db) {
      console.error("Database not initialized")
      return null
    }

    const doc = await db.collection("trainers").doc(tempId).get()

    if (!doc.exists) {
      console.log("Trainer not found:", tempId)
      return null
    }

    return { id: doc.id, ...doc.data() }
  } catch (error) {
    console.error("Error fetching trainer data:", error)
    return null
  }
}

export default async function TempTrainerPageWrapper({ params, searchParams }: PageProps) {
  const trainer = await getTrainerData(params.tempId)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainer preview...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPage trainer={trainer} tempId={params.tempId} token={searchParams.token} />
    </Suspense>
  )
}
