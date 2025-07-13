import { Suspense } from "react"
import TempTrainerPage from "./TempTrainerPage"

interface PageProps {
  searchParams: { tempId?: string }
}

export default function Page({ searchParams }: PageProps) {
  const tempId = searchParams.tempId

  if (!tempId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Trainer Link</h1>
          <p className="text-gray-600">No trainer ID provided in the URL.</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainer profile...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPage tempId={tempId} />
    </Suspense>
  )
}
