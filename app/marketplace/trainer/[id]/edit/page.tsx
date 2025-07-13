import { Suspense } from "react"
import TrainerContentEditor from "./TrainerContentEditor"

interface PageProps {
  params: { id: string }
}

export default function TrainerEditPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juice"></div>
          </div>
        }
      >
        <TrainerContentEditor trainerId={params.id} />
      </Suspense>
    </div>
  )
}
