import { notFound } from "next/navigation"
import { TrainerContentEditor } from "./TrainerContentEditor"

interface PageProps {
  params: {
    id: string
  }
}

export default async function TrainerEditPage({ params }: PageProps) {
  const { id } = params

  // Validate trainer ID format
  if (!id || id.length < 3) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Website Content</h1>
            <p className="text-gray-600">Customize your trainer profile content. Changes are saved automatically.</p>
          </div>

          <TrainerContentEditor trainerId={id} />
        </div>
      </div>
    </div>
  )
}
