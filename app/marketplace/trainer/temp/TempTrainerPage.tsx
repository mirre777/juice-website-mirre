"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, Users, Award, Calendar } from "lucide-react"

interface TempTrainer {
  id: string
  name: string
  email: string
  phone?: string
  location: string
  specialties: string[]
  experience: string
  bio: string
  services?: string[]
  pricing?: string
  availability?: string
  certifications?: string[]
  expiresAt?: string
  createdAt?: string
}

interface TempTrainerPageProps {
  trainer: TempTrainer
}

export default function TempTrainerPage({ trainer }: TempTrainerPageProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!trainer?.expiresAt) {
      setTimeLeft("No expiration set")
      return
    }

    const updateCountdown = () => {
      try {
        const expirationTime = new Date(trainer.expiresAt!).getTime()
        const now = new Date().getTime()
        const difference = expirationTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          } else if (minutes > 0) {
            setTimeLeft(`${minutes}m ${seconds}s`)
          } else {
            setTimeLeft(`${seconds}s`)
          }
          setIsExpired(false)
        } else {
          setTimeLeft("Expired")
          setIsExpired(true)
        }
      } catch (error) {
        console.error("Error calculating countdown:", error)
        setTimeLeft("Error calculating time")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [trainer?.expiresAt])

  // Provide default values for missing data
  const safeTrainer = {
    name: trainer?.name || "Unknown Trainer",
    email: trainer?.email || "No email provided",
    phone: trainer?.phone || "No phone provided",
    location: trainer?.location || "Location not specified",
    specialties: trainer?.specialties || [],
    experience: trainer?.experience || "Experience not specified",
    bio: trainer?.bio || "No bio available",
    services: trainer?.services || [],
    pricing: trainer?.pricing || "Pricing not specified",
    availability: trainer?.availability || "Availability not specified",
    certifications: trainer?.certifications || [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with countdown */}
        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <Badge variant={isExpired ? "destructive" : "secondary"} className="text-sm">
                {isExpired ? "Preview Expired" : `Preview expires in: ${timeLeft}`}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">{safeTrainer.name}</CardTitle>
            <p className="text-gray-600 text-lg">Personal Trainer Preview</p>
          </CardHeader>
        </Card>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">{safeTrainer.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-gray-600">{safeTrainer.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-600">{safeTrainer.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-600" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {safeTrainer.specialties.length > 0 ? (
                    safeTrainer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No specialties listed</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeTrainer.services.length > 0 ? (
                    safeTrainer.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No services listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Bio */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{safeTrainer.bio}</p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{safeTrainer.experience}</p>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeTrainer.certifications.length > 0 ? (
                    safeTrainer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No certifications listed</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Availability */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Pricing</p>
                  <p className="text-gray-600">{safeTrainer.pricing}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Availability</p>
                  <p className="text-gray-600">{safeTrainer.availability}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action buttons */}
        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isExpired}>
                Contact Trainer
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
                disabled={isExpired}
              >
                Book Consultation
              </Button>
            </div>
            {isExpired && (
              <p className="text-center text-red-600 mt-4 font-medium">
                This preview has expired. Please contact the trainer directly.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
