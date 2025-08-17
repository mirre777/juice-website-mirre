"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"
import type { TrainerData, TrainerContent } from "@/components/trainer/TrainerProfileDisplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface PublicTrainerPageProps {
  params: {
    id: string
  }
}

export default function PublicTrainerPage({ params }: PublicTrainerPageProps) {
  const { id } = params
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch public trainer data
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/content/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load trainer profile")
        }

        if (data.success && data.trainer) {
          // Only show active/paid trainers publicly
          if (!data.trainer.isActive || !data.trainer.isPaid) {
            throw new Error("This trainer profile is not publicly available")
          }

          setTrainer(data.trainer)
          setContent(data.content || generateDefaultContent(data.trainer))
        } else {
          throw new Error("Trainer profile not found")
        }
      } catch (err) {
        console.error("Error fetching public trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer profile")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTrainer()
    }
  }, [id])

  // Generate default content for trainers without content
  const generateDefaultContent = (trainerData: any): TrainerContent => {
    const location =
      trainerData.city && trainerData.district
        ? `${trainerData.city}, ${trainerData.district}`
        : trainerData.location || "Location not specified"

    return {
      hero: {
        title: `Transform Your Fitness with ${trainerData.fullName}`,
        subtitle: `Professional ${trainerData.specialty} trainer in ${location}`,
        description:
          trainerData.bio ||
          "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
      },
      about: {
        title: `About ${trainerData.fullName}`,
        bio:
          trainerData.bio ||
          "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
      },
      services: trainerData.services?.map((service: string, index: number) => ({
        id: String(index + 1),
        title: service,
        description: `Professional ${service.toLowerCase()} sessions tailored to your goals`,
        price: 60,
        duration: "60 minutes",
        featured: index === 0,
      })) || [
        {
          id: "1",
          title: "Personal Training",
          description: "Personalized training sessions tailored to your goals",
          price: 60,
          duration: "60 minutes",
          featured: true,
        },
      ],
      contact: {
        title: "Ready to Start Your Fitness Journey?",
        description: "Get in touch to schedule your first session or ask any questions.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        location: location,
      },
    }
  }

  // Handle booking actions
  const handleScheduleSession = () => {
    // TODO: Implement booking system
    alert("Booking system coming soon! Please contact the trainer directly.")
  }

  const handleSendMessage = () => {
    // TODO: Implement messaging system
    alert("Messaging system coming soon! Please contact the trainer directly.")
  }

  const handleBookConsultation = () => {
    // TODO: Implement consultation booking
    alert("Consultation booking coming soon! Please contact the trainer directly.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Available</h2>
              <p className="text-gray-600 mb-4">{error || "This trainer profile is not available or doesn't exist."}</p>
              <Button onClick={() => router.push("/marketplace")}>Browse Other Trainers</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean public display with no admin controls */}
      <TrainerProfileDisplay
        trainer={trainer}
        content={content}
        mode="public"
        onBookConsultation={handleBookConsultation}
        onScheduleSession={handleScheduleSession}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
