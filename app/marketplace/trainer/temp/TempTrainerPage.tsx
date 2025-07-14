"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import { logger } from "@/lib/logger"

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  services: string[]
  experience: string
  certifications: string[]
  bio: string
  specialties: string[]
  sessionToken: string
  expiresAt: any
  isActive: boolean
  isPaid: boolean
}

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    fetchTrainerData()
  }, [tempId, token])

  useEffect(() => {
    if (trainer?.expiresAt) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(trainer.expiresAt.seconds * 1000).getTime()
        const difference = expiry - now

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining("Expired")
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [trainer])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      setError(null)

      logger.info("Fetching trainer data", { tempId, hasToken: !!token })

      const url = `/api/trainer/temp/${tempId}${token ? `?token=${encodeURIComponent(token)}` : ""}`
      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error("API response not ok", {
          tempId,
          status: response.status,
          statusText: response.statusText,
          errorText,
        })
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        logger.error("Response is not JSON", { tempId, contentType, responseText: text.substring(0, 200) })
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch trainer data")
      }

      setTrainer(data.trainer)
      logger.info("Trainer data fetched successfully", { tempId, trainerName: data.trainer.fullName })
    } catch (error) {
      logger.error("Network error fetching trainer data", {
        tempId,
        error: error instanceof Error ? error.message : String(error),
      })
      setError(error instanceof Error ? error.message : "Failed to load trainer data")
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = () => {
    // TODO: Implement Stripe payment flow
    alert("Payment integration coming soon!")
  }

  const handleRetry = () => {
    fetchTrainerData()
  }

  const handleCreateNew = () => {
    window.location.href = "/marketplace/personal-trainer-website"
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">Network error: {error}</p>
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleCreateNew} variant="outline" className="w-full bg-transparent">
                Create New Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Trainer Not Found</h2>
            <p className="text-gray-600 mb-4">The trainer profile could not be found or has expired.</p>
            <Button onClick={handleCreateNew} className="w-full">
              Create New Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="font-semibold">Website Preview</h1>
              <p className="text-sm text-gray-600">24-hour trial period</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Time remaining: {timeRemaining}</span>
            </div>
            <Button onClick={handleActivate} className="bg-lime-400 hover:bg-lime-500 text-black">
              Activate for €29
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-lime-400 rounded-lg p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Transform Your Body, Transform Your Life</h1>
          <div className="flex items-center justify-center space-x-2 text-black mb-6">
            <span>{trainer.services?.[0] || "Personal Trainer"}</span>
            <span>•</span>
            <span>{trainer.experience || "Professional Experience"}</span>
            <span>•</span>
            <span>{trainer.location}</span>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">Book Your Free Consultation</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-lime-400" />
                  <h2 className="text-xl font-semibold">About {trainer.fullName}</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {trainer.bio ||
                    `Welcome to my fitness journey! I'm ${trainer.fullName}, a dedicated ${trainer.services?.[0] || "personal trainer"} based in ${trainer.location}. With ${trainer.experience || "professional experience"}, I'm here to help you achieve your fitness goals through personalized training programs and expert guidance.`}
                </p>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span>📊</span>
                    <span>{trainer.experience || "Professional Experience"}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Certified Professional</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">My Training Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    trainer.services || [
                      "Personal Training",
                      "Group Sessions",
                      "Nutrition Coaching",
                      "Fitness Assessment",
                    ]
                  ).map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">{service}</h3>
                      <p className="text-sm text-gray-600">
                        Professional {service.toLowerCase()} tailored to your needs
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{trainer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{trainer.location}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-lime-400 hover:bg-lime-500 text-black">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    trainer.specialties ||
                    trainer.services || ["Strength Training", "Weight Loss", "Muscle Building"]
                  ).map((specialty, index) => (
                    <Badge key={index} className="bg-lime-100 text-lime-800 hover:bg-lime-200">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
