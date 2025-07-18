import { Suspense } from "react"
import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"
import { db } from "@/app/api/firebase-config"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

async function getTrainerData(tempId: string) {
  try {
    if (!db) {
      console.error("Database not available")
      return null
    }

    const docRef = db.collection("trainers").doc(tempId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return null
    }

    const data = docSnap.data()
    if (!data) {
      return null
    }

    return {
      ...data,
      id: docSnap.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    }
  } catch (error) {
    console.error("Error fetching trainer data:", error)
    return null
  }
}

export default async function TempTrainerPageWrapper({ params, searchParams }: PageProps) {
  const { tempId } = params
  const { token } = searchParams

  // Try to fetch trainer data server-side
  const trainer = await getTrainerData(tempId)

  // If no trainer found, show not found
  if (!trainer) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainer preview...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPage trainer={trainer} tempId={tempId} token={token} />
    </Suspense>
  )
}
