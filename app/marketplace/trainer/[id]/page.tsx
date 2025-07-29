import { Suspense } from "react"
import TrainerProfilePage from "./TrainerProfilePage"

interface PageProps {
  params: {
    id: string
  }
}

export default function TrainerPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            </div>
            <p className="text-gray-600">Loading trainer profile...</p>
          </div>
        </div>
      }
    >
      <TrainerProfilePage trainerId={params.id} />
    </Suspense>
  )
}
