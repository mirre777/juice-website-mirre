import { Suspense } from "react"
import { notFound } from "next/navigation"
import TempTrainerPage from "../TempTrainerPage"
import { getTrainerTemp } from "@/lib/firebase-trainer"

interface PageProps {
  params: {
    tempId: string
  }
  searchParams: {
    token?: string
  }
}

async function TempTrainerPageWrapper({ params, searchParams }: PageProps) {
  try {
    const trainer = await getTrainerTemp(params.tempId)

    if (!trainer) {
      notFound()
    }

    // Map the trainer data to match the expected interface
    const mappedTrainer = {
      id: trainer.id,
      name: trainer.fullName || trainer.email,
      fullName: trainer.fullName,
      email: trainer.email,
      phone: trainer.phone,
      location: trainer.location,
      specialization: trainer.specialty || "Fitness Training",
      experience: trainer.experience,
      bio: trainer.bio,
      certifications: trainer.certifications ? [trainer.certifications] : undefined,
      services: trainer.services,
      specialties: trainer.services,
      status: trainer.status,
      createdAt: trainer.createdAt,
      expiresAt: trainer.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now if not set
      hasSessionToken: !!searchParams.token,
      sessionToken: searchParams.token,
    }

    return <TempTrainerPage trainer={mappedTrainer} token={searchParams.token} />
  } catch (error) {
    console.error("Error loading temp trainer:", error)
    notFound()
  }
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainer preview...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPageWrapper params={params} searchParams={searchParams} />
    </Suspense>
  )
}
