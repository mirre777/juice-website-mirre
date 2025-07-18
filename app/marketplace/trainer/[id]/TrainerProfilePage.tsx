"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Users, Dumbbell, Award, Phone, Mail, Edit, ExternalLink } from "lucide-react"

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
    hero?: {
      title?: string
      subtitle?: string
      description?: string
    }
    about?: {
      title?: string
      content?: string
    }
    services?: Array<{
      id: string
      title: string
      description: string
      price: number
      duration: string
      featured: boolean
    }>
    contact?: {
      title?: string
      description?: string
      email?: string
      phone?: string
      location?: string
    }
    testimonials?: Array<{
      name: string
      text: string
      rating: number
    }>
  }
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchTrainer = async () => {
      try {
        console.log("=== FETCHING TRAINER PROFILE ===")
        console.log("Trainer ID:", trainerId)

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
          console.log("Setting trainer data:", data.trainer)
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
                <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
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

  // Safe access to trainer data with fallbacks
  const heroTitle = trainer.content?.hero?.title || `Transform Your Fitness with ${trainer.fullName}`
  const heroSubtitle =
    trainer.content?.hero?.subtitle || `Professional ${trainer.specialty} trainer in ${trainer.location}`
  const aboutTitle = trainer.content?.about?.title || `About ${trainer.fullName}`
  const aboutContent =
    trainer.content?.about?.content ||
    trainer.bio ||
    "Experienced personal trainer dedicated to helping clients achieve their fitness goals."

  // Safe services array with fallback
  const services = trainer.content?.services || []
  const trainerServices = Array.isArray(trainer.services) ? trainer.services : []

  // Default services if none exist
  const defaultServices = [
    {
      id: "1",
      title: "Personal Training",
      description: "One-on-one personalized training sessions",
      price: 60,
      duration: "60 minutes",
      featured: true,
    },
    {
      id: "2",
      title: "Group Training",
      description: "Small group training sessions",
      price: 35,
      duration: "60 minutes",
      featured: false,
    },
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  // Safe testimonials with fallback
  const testimonials = trainer.content?.testimonials || [
    {
      name: "Sarah M.",
      text: `Working with ${trainer.fullName} has completely transformed my fitness journey. Their expertise is unmatched!`,
      rating: 5,
    },
    {
      name: "Mike R.",
      text: "Professional, knowledgeable, and motivating. I've achieved results I never thought possible!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-500">
                Live
              </Badge>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
            <p className="text-xl mb-6 opacity-90">{heroSubtitle}</p>
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
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {aboutTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{aboutContent}</p>
                {trainer.certifications && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-gray-600">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayServices.map((service, index) => (
                    <div key={service.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{service.title}</h3>
                          {service.featured && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">€{service.price}</div>
                          <div className="text-sm text-gray-500">{service.duration}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic">{testimonial.text}</p>
                      <p className="text-sm text-gray-500 mt-2">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                  <span className="font-semibold">{displayServices.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Profile Management</h3>
                  <p className="text-sm text-blue-700 mb-4">Your profile is live and attracting clients!</p>
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
