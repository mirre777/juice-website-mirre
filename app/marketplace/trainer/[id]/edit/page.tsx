import { Suspense } from "react"
import TrainerContentEditor from "./TrainerContentEditor"

export default function EditTrainerPage({ params }: { params: { id: string } }) {
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
