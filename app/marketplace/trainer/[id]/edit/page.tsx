import { notFound } from "next/navigation"
import { TrainerContentEditor } from "./TrainerContentEditor"
import { logger } from "@/lib/logger"

interface EditPageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: EditPageProps) {
  try {
    logger.info("Loading trainer edit page", { trainerId: params.id })

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Edit Your Website Content</h1>
              <p className="text-gray-600 mt-2">
                Customize your trainer profile content. Changes are saved automatically.
              </p>
            </div>

            <TrainerContentEditor trainerId={params.id} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    logger.error("Error loading trainer edit page", { error, trainerId: params.id })
    notFound()
  }
}
