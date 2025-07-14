"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Star, MapPin, Phone, Mail, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
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
  isActive: boolean
  isPaid: boolean
  createdAt: any
  expiresAt: any
  requestId: string
}

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

export default function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

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
        logger.error("Response not JSON", { tempId, contentType, text: text.substring(0, 200) })
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      logger.info("Trainer data fetched successfully", { tempId, trainerId: data.id })

      setTrainer(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      logger.error("Network error fetching trainer data", { tempId, error: errorMessage })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tempId) {
      fetchTrainerData()
    }
  }, [tempId, token])

  useEffect(() => {
    if (trainer?.expiresAt) {
      const updateTimer = () => {
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
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [trainer])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">Network error: {error}</p>
              <div className="space-y-2">
                <Button onClick={fetchTrainerData} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/marketplace/personal-trainer-website">Create New Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">No access token provided</p>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/marketplace/personal-trainer-website">Return to Form</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-lime-400 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Website Preview</h1>
                <p className="text-sm text-gray-600">24-hour trial period</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Time remaining: {timeRemaining}</span>
              </div>
              <Button className="bg-lime-400 hover:bg-lime-500 text-black">Activate for €29</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-lime-400 to-lime-500">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Transform Your Body, Transform Your Life</h1>
            <div className="flex items-center justify-center space-x-2 text-black mb-6">
              <span>{trainer.services?.[0] || "Personal Trainer"}</span>
              <span>•</span>
              <span>{trainer.experience}</span>
              <span>•</span>
              <span>{trainer.location}</span>
            </div>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Book Your Free Consultation
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-lime-400" />
                  <span>About {trainer.fullName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {trainer.bio ||
                    `Welcome to my fitness journey! I'm ${trainer.fullName}, a dedicated ${trainer.services?.[0] || "personal trainer"} with ${trainer.experience} of experience. I'm passionate about helping clients achieve their fitness goals through personalized training programs and nutritional guidance.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-yellow-400 rounded-full"></span>
                    <span>{trainer.experience}</span>
                  </Badge>
                  {trainer.certifications?.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                      <span>{cert}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Training Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.services?.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{service}</h3>
                      <p className="text-sm text-gray-600">
                        Personalized {service.toLowerCase()} sessions tailored to your fitness level and goals.
                      </p>
                    </div>
                  )) || (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Personal Training</h3>
                      <p className="text-sm text-gray-600">
                        One-on-one training sessions tailored to your specific fitness goals.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{trainer.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{trainer.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{trainer.location}</span>
                </div>
                <Separator />
                <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties?.map((specialty, index) => (
                    <Badge key={index} className="bg-lime-400 text-black hover:bg-lime-500">
                      {specialty}
                    </Badge>
                  )) || (
                    <Badge className="bg-lime-400 text-black hover:bg-lime-500">
                      {trainer.services?.[0] || "Personal Training"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
