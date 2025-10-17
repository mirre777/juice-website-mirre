"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star, Phone, Mail, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import type { TempTrainerData } from "@/types/trainer"

interface TempTrainerPageProps {
  trainer: TempTrainerData
}

export default function TempTrainerPage({ trainer }: TempTrainerPageProps) {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate time remaining
  useEffect(() => {
    if (!trainer?.createdAt) {
      setIsLoading(false)
      return
    }

    const updateTimer = () => {
      try {
        const createdTime = new Date(trainer.createdAt).getTime()
        const expiryTime = createdTime + 24 * 60 * 60 * 1000 // 24 hours
        const now = Date.now()
        const remaining = expiryTime - now

        if (remaining <= 0) {
          setIsExpired(true)
          setTimeRemaining("Expired")
          setIsLoading(false)
          return
        }

        const hours = Math.floor(remaining / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        setIsLoading(false)
      } catch (error) {
        console.error("Error calculating time:", error)
        setIsLoading(false)
      }
    }

    // Initial calculation
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [trainer?.createdAt])

  const handleActivate = () => {
    if (!trainer?.tempId) return

    // Store temp trainer data for payment flow
    sessionStorage.setItem("tempTrainerData", JSON.stringify(trainer))
    router.push(`/payment?tempId=${trainer.tempId}`)
  }

  const handleBookConsultation = () => {
    alert("This is a preview. Activate your profile to enable booking!")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2FF28] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer preview...</p>
        </div>
      </div>
    )
  }

  // Show expired state
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Expired</h2>
            <p className="text-gray-600 mb-6">
              This trainer preview has expired. Please create a new profile to continue.
            </p>
            <Button
              onClick={() => router.push("/marketplace/personal-trainer-website")}
              className="bg-[#D2FF28] hover:bg-[#B8E625] text-black"
            >
              Create New Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if no trainer data
  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h2>
            <p className="text-gray-600 mb-6">
              The trainer profile you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/marketplace/personal-trainer-website")}
              className="bg-[#D2FF28] hover:bg-[#B8E625] text-black"
            >
              Create New Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-[#D2FF28] border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-black" />
              <span className="font-semibold text-black">Preview Mode - Expires in: {timeRemaining}</span>
            </div>
            <Button
              onClick={handleActivate}
              size="sm"
              className="bg-black text-[#D2FF28] hover:bg-gray-800 font-semibold"
            >
              Activate for €70
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{trainer.fullName}</h1>
                <p className="text-xl text-gray-300 mb-4">{trainer.specialty} Specialist</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {trainer.city}, {trainer.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#D2FF28]" />
                    <span>New Trainer</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-[#D2FF28] text-black font-semibold">
                  PREVIEW
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {trainer.bio ||
                    `Hi! I'm ${trainer.fullName}, a dedicated ${trainer.specialty.toLowerCase()} specialist based in ${trainer.city}. I'm passionate about helping clients achieve their fitness goals through personalized training programs and expert guidance.`}
                </p>

                {trainer.certifications && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.split(",").map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {trainer.services && trainer.services.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {trainer.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Card */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Get In Touch</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {trainer.city}, {trainer.district}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBookConsultation}
                  className="w-full bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold mb-3"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>

                <Button
                  onClick={handleActivate}
                  variant="outline"
                  className="w-full border-[#D2FF28] text-black hover:bg-[#D2FF28] bg-transparent"
                >
                  Activate Profile - €70
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activation CTA */}
        <Card className="bg-gradient-to-r from-[#D2FF28] to-[#B8E625] border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Ready to Go Live?</h2>
            <p className="text-black/80 mb-6">
              Activate your profile to start accepting clients and bookings. Your website will be live in minutes!
            </p>
            <Button
              onClick={handleActivate}
              size="lg"
              className="bg-black text-[#D2FF28] hover:bg-gray-800 font-semibold px-8"
            >
              Activate Now - €70
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
