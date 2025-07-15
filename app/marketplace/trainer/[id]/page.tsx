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

export async function generateMetadata({ params }: PageProps) {
  try {
    // Fetch trainer data for SEO
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/trainer/dashboard/${params.id}`)
    
    if (response.ok) {
      const data = await response.json()
      const trainer = data.trainer
      
      if (trainer?.content?.seo) {
        return {
          title: trainer.content.seo.title,
          description: trainer.content.seo.description,
        }
      }
      
      return {
        title: `${trainer?.fullName || trainer?.name} - Personal Trainer`,
        description: `Professional ${trainer?.specialty} training with ${trainer?.fullName || trainer?.name} in ${trainer?.location}`,
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Personal Trainer Profile",
    description: "Professional personal training services",
  }
}
