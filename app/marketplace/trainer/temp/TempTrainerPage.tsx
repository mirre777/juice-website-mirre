"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Globe, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

interface TrainerData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  specialization: string
  bio: string
  experience: string
  certifications: string[]
  services: string[]
  pricing: Record<string, any>
  availability: Record<string, any>
  website: string
  socialMedia: Record<string, string>
  images: string[]
  testimonials: any[]
  content: any
  isActive: boolean
  isPaid: boolean
  createdAt: string
  expiresAt: string
  token: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTrainerData() {
      try {
        console.log("Loading trainer data", { tempId, hasToken: !!token })

        if (!tempId) {
          throw new Error("No trainer ID provided")
        }

        if (!token) {
          throw new Error("No access token provided")
        }

        const url = `/api/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`
        console.log("Fetching from URL:", url)

        const response = await fetch(url)
        console.log("Response status:", response.status)
        console.log("Response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          })
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log("Trainer data received:", {
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          trainerName: data?.name,
        })

        setTrainer(data)
      } catch (err) {
        console.error("Error loading trainer data:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer data")
      } finally {
        setLoading(false)
      }
    }

    loadTrainerData()
  }, [tempId, token])

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
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The trainer profile you're looking for doesn't exist or the preview has expired."}
          </p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const expiresAt = new Date(trainer.expiresAt)
  const timeRemaining = Math.max(0, expiresAt.getTime() - Date.now())
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Preview Mode - Expires in {hoursRemaining}h {minutesRemaining}m
            </span>
          </div>
          <Link href="/marketplace">
            <Button variant="outline" size="sm">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={trainer.images?.[0] || "/placeholder.svg"} alt={trainer.name} />
                <AvatarFallback className="text-2xl">
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainer.name}</h1>
                <p className="text-xl text-blue-600 mb-3">{trainer.specialization}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {trainer.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {trainer.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {trainer.location}
                    </div>
                  )}
                  {trainer.experience && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {trainer.experience}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {trainer.bio && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Services Section */}
        {trainer.services && trainer.services.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainer.services.map((service, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainer.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{trainer.email}</span>
                </div>
              )}
              {trainer.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{trainer.phone}</span>
                </div>
              )}
              {trainer.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <a
                    href={trainer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {trainer.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        {trainer.testimonials && trainer.testimonials.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Client Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trainer.testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-700 italic mb-2">"{testimonial.text}"</p>
                    <p className="text-sm font-medium text-gray-900">- {testimonial.author}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Preview Mode</h3>
                <p className="text-blue-700 mb-4">
                  This is a preview of your trainer profile. To make it live and accessible to clients, you'll need to
                  complete the activation process.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/payment?tempId=${tempId}&token=${token}`}>
                    <Button className="w-full sm:w-auto">Activate Profile - €29</Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Back to Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
