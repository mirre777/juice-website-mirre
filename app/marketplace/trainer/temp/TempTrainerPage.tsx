"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"
import type { DisplayTrainerData, DisplayTrainerContent } from "@/components/trainer/TrainerProfileDisplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock } from "lucide-react"

interface TempTrainerData {
  tempId: string
  fullName: string
  email: string
  phone?: string
  city?: string
  district?: string
  specialty: string
  bio?: string
  certifications?: string
  services: string[]
  createdAt: string
  expiresAt: string
  isExpired: boolean
}

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const router = useRouter()

  // Fetch temp trainer data
  useEffect(() => {
    const fetchTempTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load trainer preview")
        }

        if (data.success && data.trainer) {
          setTrainer(data.trainer)

          // Calculate initial time left
          const expiresAt = new Date(data.trainer.expiresAt).getTime()
          const now = Date.now()
          const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
          setTimeLeft(remaining)
        } else {
          throw new Error("Trainer preview not found")
        }
      } catch (err) {
        console.error("Error fetching temp trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer preview")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTempTrainer()
    }
  }, [tempId])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          // Mark as expired and redirect
          setTimeout(() => {
            router.push("/marketplace/personal-trainer-website")
          }, 3000)
        }
        return Math.max(0, newTime)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, router])

  // Format time for display
  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "Expired"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Transform temp trainer data to display format
  const transformToDisplayFormat = (
    tempTrainer: TempTrainerData,
  ): {
    displayTrainer: DisplayTrainerData
    displayContent: DisplayTrainerContent
  } => {
    // Parse location
    const locationParts = tempTrainer.city ? tempTrainer.city.split(", ") : []
    const city = locationParts[0] || ""
    const district = locationParts[1] || tempTrainer.district || ""

    const displayTrainer: DisplayTrainerData = {
      id: tempTrainer.tempId,
      fullName: tempTrainer.fullName,
      email: tempTrainer.email,
      phone: tempTrainer.phone,
      city: city,
      district: district,
      specialty: tempTrainer.specialty,
      bio: tempTrainer.bio,
      certifications: tempTrainer.certifications,
      services: tempTrainer.services,
      status: "temp",
      isActive: false,
      isPaid: false,
    }

    // Generate enhanced services from string array
    const enhancedServices = tempTrainer.services.map((service, index) => ({
      id: `service-${index}`,
      title: service,
      description: `Professional ${service.toLowerCase()} service tailored to your fitness goals`,
      price: index === 0 ? 75 : 60, // First service is premium
      duration: "60 minutes",
      featured: index === 0,
    }))

    const displayContent: DisplayTrainerContent = {
      hero: {
        title: `Transform Your Fitness with ${tempTrainer.fullName}`,
        subtitle: `Professional ${tempTrainer.specialty} Trainer`,
        description:
          tempTrainer.bio ||
          `Get personalized ${tempTrainer.specialty.toLowerCase()} training and achieve your fitness goals with expert guidance.`,
      },
      about: {
        title: "About Me",
        bio:
          tempTrainer.bio ||
          `I'm a certified ${tempTrainer.specialty} trainer passionate about helping clients achieve their fitness goals. With personalized training programs and dedicated support, I'll help you transform your health and fitness journey.`,
      },
      contact: {
        title: "Ready to Start Your Fitness Journey?",
        description: "This is a preview of your trainer profile. Activate now to start accepting clients and bookings!",
        phone: tempTrainer.phone || "",
        email: tempTrainer.email,
        location: city && district ? `${city}, ${district}` : city || "Location",
      },
      services: enhancedServices,
    }

    return { displayTrainer, displayContent }
  }

  // Handle activation
  const handleActivate = () => {
    // Store temp trainer data for payment flow
    sessionStorage.setItem("tempTrainerData", JSON.stringify(trainer))
    sessionStorage.setItem("tempTrainerToken", tempId)

    // Redirect to payment
    router.push("/payment?plan=trainer&tempId=" + tempId)
  }

  // Handle consultation booking (preview only)
  const handleBookConsultation = () => {
    alert("This is a preview! Activate your profile to enable client bookings.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer preview...</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview Not Found</h2>
              <p className="text-gray-600 mb-4">{error || "This trainer preview has expired or doesn't exist."}</p>
              <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if expired
  const isExpired = timeLeft <= 0 || trainer.isExpired

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview Expired</h2>
              <p className="text-gray-600 mb-4">
                This trainer preview has expired. Create a new profile to get started.
              </p>
              <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform data for display component
  const { displayTrainer, displayContent } = transformToDisplayFormat(trainer)

  return (
    <TrainerProfileDisplay
      trainer={displayTrainer}
      content={displayContent}
      mode="temp"
      timeLeft={formatTimeLeft(timeLeft)}
      isExpired={isExpired}
      activationPrice="€70"
      onActivate={handleActivate}
      onBookConsultation={handleBookConsultation}
    />
  )
}
