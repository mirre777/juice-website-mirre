import { Suspense } from "react"
import TrainerContentEditor from "./TrainerContentEditor"

export default function EditTrainerPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="p-8">Loading editor...</div>}>
        <TrainerContentEditor trainerId={params.id} />
      </Suspense>
    </div>
  )
}
