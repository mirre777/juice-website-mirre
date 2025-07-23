"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrainerProfileDisplay } from "@/components/trainer/TrainerProfileDisplay"
import type { TrainerData, DisplayTrainerData } from "@/types/trainer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"

interface TempTrainerPageProps {
  tempTrainer: TrainerData
  tempId: string
  timeLeft: number
}

export default function TempTrainerPage({ tempTrainer, tempId, timeLeft }: TempTrainerPageProps) {
  const router = useRouter()
  const [currentTimeLeft, setCurrentTimeLeft] = useState(timeLeft)
  const [isExpired, setIsExpired] = useState(timeLeft <= 0)

  // Convert TrainerData to DisplayTrainerData format
  const convertToDisplayFormat = (trainer: TrainerData): DisplayTrainerData => {
    // Parse location string (e.g., "Dublin, City Centre" -> city: "Dublin", district: "City Centre")
    const locationParts = trainer.location?.split(", ") || []
    const city = locationParts[0] || ""
    const district = locationParts[1] || ""

    // Convert services array to structured format with pricing
    const services =
      trainer.services?.map((service) => ({
        name: service,
        price: "€50/session", // Default pricing for temp preview
        description: `Professional ${service.toLowerCase()} training`,
      })) || []

    return {
      id: trainer.id || tempId,
      name: trainer.name || "Professional Trainer",
      title: trainer.title || "Certified Personal Trainer",
      location: {
        city,
        district,
        full: trainer.location || "Location TBD",
      },
      avatar: trainer.profileImage || "/placeholder-user.jpg",
      coverImage: trainer.coverImage || "/placeholder.jpg",
      rating: 4.8, // Default rating for preview
      reviewCount: 12, // Default review count
      experience: trainer.experience || "5+ years",
      specialties: trainer.specialties || [],
      services,
      content: {
        hero: {
          title: `Transform Your Fitness with ${trainer.name || "Professional Training"}`,
          subtitle:
            trainer.bio || "Achieve your fitness goals with personalized training programs designed just for you.",
          cta: "Start Your Journey",
        },
        about: {
          title: "About Your Trainer",
          content:
            trainer.bio ||
            "Experienced fitness professional dedicated to helping you achieve your health and wellness goals through personalized training programs.",
          highlights: [
            `${trainer.experience || "5+"} years of experience`,
            "Certified personal trainer",
            "Personalized approach",
            "Proven results",
          ],
        },
        contact: {
          title: "Ready to Get Started?",
          subtitle: "Book your consultation today and take the first step towards your fitness transformation.",
          cta: "Book Consultation",
        },
      },
      pricing: {
        consultation: "€30",
        session: "€50",
        package: "€200/month",
      },
      availability: "Available for new clients",
      certifications: trainer.certifications || ["Certified Personal Trainer"],
      languages: ["English"],
      isActive: false, // Temp trainers are not active yet
    }
  }

  const displayTrainer = convertToDisplayFormat(tempTrainer)

  // Countdown timer effect
  useEffect(() => {
    if (currentTimeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setCurrentTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          setIsExpired(true)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTimeLeft])

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle activation
  const handleActivate = () => {
    router.push(`/payment?tempId=${tempId}&type=trainer-activation`)
  }

  // Handle expired state
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Expired</h1>
            <p className="text-gray-600 mb-6">
              This trainer preview has expired. Please create a new trainer profile to continue.
            </p>
            <Button onClick={() => router.push("/marketplace/personal-trainer-website")} className="w-full">
              Create New Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner with Countdown */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Preview Mode</span>
            <span className="text-blue-100">•</span>
            <span className="font-mono text-lg">{formatTime(currentTimeLeft)}</span>
          </div>
          <Button
            onClick={handleActivate}
            variant="secondary"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
          >
            Activate Now - €30
          </Button>
        </div>
      </div>

      {/* Trainer Profile Display */}
      <TrainerProfileDisplay
        trainer={displayTrainer}
        mode="temp"
        timeLeft={currentTimeLeft}
        onActivate={handleActivate}
      />

      {/* Activation CTA Footer */}
      <div className="bg-white border-t border-gray-200 py-6 px-4 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to go live?</h3>
            <p className="text-sm text-gray-600">Activate your trainer profile and start accepting clients</p>
          </div>
          <Button
            onClick={handleActivate}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Activate for €30
          </Button>
        </div>
      </div>
    </div>
  )
}
