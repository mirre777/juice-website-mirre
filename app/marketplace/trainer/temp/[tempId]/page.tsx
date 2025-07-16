import { Suspense } from "react"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: Promise<{ tempId: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function TempTrainerPageRoute({ params, searchParams }: PageProps) {
  const { tempId } = await params
  const { token } = await searchParams

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your trainer profile...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPage tempId={tempId} token={token} />
    </Suspense>
  )
}
