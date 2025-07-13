import { Suspense } from "react"
import TempTrainerPage from "./TempTrainerPage"

interface PageProps {
  searchParams: { id?: string }
}

function TempTrainerPageWrapper({ searchParams }: PageProps) {
  const tempId = searchParams.id

  if (!tempId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-gray-600 mb-4">No trainer ID provided</p>
          <a
            href="/marketplace/personal-trainer-website"
            className="inline-flex items-center px-4 py-2 bg-[#D2FF28] text-black rounded-lg hover:bg-[#D2FF28]/90"
          >
            Return to Form
          </a>
        </div>
      </div>
    )
  }

  return <TempTrainerPage tempId={tempId} />
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-black rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPageWrapper searchParams={searchParams} />
    </Suspense>
  )
}
