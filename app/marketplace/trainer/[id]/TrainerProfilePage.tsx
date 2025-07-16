"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Users, Dumbbell, Award, Phone, Mail, Edit, ExternalLink } from 'lucide-react'

interface TrainerProfilePageProps {
  trainerId: string
}

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  content?: {
    heroTitle?: string
    heroSubtitle?: string
    aboutSection?: string
    servicesSection?: string
    testimonialsSection?: string
    contactSection?: string
  }
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch trainer data
  useEffect(() => {
    if (!mounted) return

    const fetchTrainer = async () => {
      try {
        console.log("Fetching trainer data for ID:", trainerId)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        const data = await response.json()

        console.log("API Response:", data)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Trainer profile not found")
          } else if (response.status === 403) {
            setError("This trainer profile is not active")
          } else {
            setError(data.error || "Failed to load trainer profile")
          }
          setLoading(false)
          return
        }

        if (data.success && data.trainer) {
          setTrainer(data.trainer)
        } else {
          setError(data.error || "Failed to load trainer data")
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching trainer:", err)
        setError("Failed to load trainer profile")
        setLoading(false)
      }
    }

    if (trainerId) {
      fetchTrainer()
    }
  }, [trainerId, mounted])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
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
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/marketplace")}
                  className="w-full"
                >
                  Back to Marketplace
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-4">The trainer profile could not be loaded.</p>
              <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with edit button for the trainer */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-500">Live</Badge>
              <Badge variant="secondary">Active Profile</Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/marketplace/trainer/${trainerId}/dashboard`)}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Website Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {trainer.content?.heroTitle || `Transform Your Fitness with ${trainer.fullName}`}
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {trainer.content?.heroSubtitle || `Professional ${trainer.specialty} trainer in ${trainer.location}`}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="text-blue-600">
                <Award className="h-4 w-4 mr-1" />
                {trainer.experience} Experience
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <MapPin className="h-4 w-4 mr-1" />
                {trainer.location}
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <Dumbbell className="h-4 w-4 mr-1" />
                {trainer.specialty}
              </Badge>
            </div>
            <Button size="lg" variant="secondary" className="text-blue-600">
              Book Free Consultation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  About {trainer.fullName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{trainer.content?.aboutSection || trainer.bio}</p>
                {trainer.certifications && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-gray-600">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {trainer.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "Working with {trainer.fullName} has completely transformed my fitness journey. Their expertise in{" "}
                      {trainer.specialty.toLowerCase()} is unmatched!"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">- Sarah M.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "Professional, knowledgeable, and motivating. I've achieved results I never thought possible!"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">- Mike R.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{trainer.email}</span>
                </div>
                {trainer.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{trainer.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{trainer.location}</span>
                </div>
                <Separator />
                <Button className="w-full">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{trainer.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold">{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{trainer.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold">{trainer.services.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Management */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Profile Management</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Your profile is live and attracting clients!
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit Content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/marketplace/trainer/${trainerId}/dashboard`)}
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      View Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
