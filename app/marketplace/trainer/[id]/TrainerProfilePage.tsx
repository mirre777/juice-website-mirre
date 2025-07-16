"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Phone, Mail, Clock, CheckCircle, Euro } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
  }
  services: Array<{
    title: string
    description: string
    price: string
  }>
  testimonials: Array<{
    name: string
    text: string
    rating: number
  }>
  contact: {
    email: string
    phone: string
    location: string
    availability: string
  }
}

interface TrainerData {
  id: string
  name: string
  fullName?: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio?: string
  certifications?: string[]
  content?: TrainerContent
  isActive: boolean
  activatedAt?: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const { isCoach } = useTheme()
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerContent = async () => {
      try {
        console.log("=== TRAINER PROFILE PAGE DEBUG ===")
        console.log("1. Starting fetch for trainer ID:", trainerId)
        console.log("2. Current URL:", window.location.href)
        console.log("3. Making API call to:", `/api/trainer/content/${trainerId}`)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        console.log("4. API Response status:", response.status)
        console.log("5. API Response ok:", response.ok)

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        console.log("6. Response content-type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
          // If it's not JSON, get the text to see what the server returned
          const textResponse = await response.text()
          console.log("7. Non-JSON response received:", textResponse.substring(0, 200))
          throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}`)
        }

        const data = await response.json()
        console.log("8. JSON response parsed successfully:", data)

        if (!response.ok) {
          console.log("9. API returned error:", data)
          throw new Error(data.error || data.details || "Failed to fetch trainer content")
        }

        if (data.success && data.trainer) {
          console.log("10. Setting trainer data:", {
            id: data.trainer.id,
            name: data.trainer.name,
            isActive: data.trainer.isActive,
            hasContent: !!data.trainer.content,
          })
          setTrainerData(data.trainer)
        } else {
          console.log("11. Invalid trainer data structure:", data)
          throw new Error("Invalid trainer data received")
        }
      } catch (error) {
        console.error("12. Error in fetchTrainerContent:", error)
        console.error("13. Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        })
        setError(error instanceof Error ? error.message : "Failed to load trainer content")
      } finally {
        console.log("14. Setting loading to false")
        setLoading(false)
      }
    }

    if (trainerId) {
      console.log("=== TRAINER PROFILE PAGE INIT ===")
      console.log("Trainer ID provided:", trainerId)
      fetchTrainerContent()
    } else {
      console.error("No trainer ID provided!")
      setError("No trainer ID provided")
      setLoading(false)
    }
  }, [trainerId])

  if (loading) {
    console.log("Rendering loading state for trainer:", trainerId)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          </div>
          <p className="text-lg text-gray-900">Loading trainer profile...</p>
          <p className="text-sm mt-2 text-gray-600">ID: {trainerId}</p>
        </div>
      </div>
    )
  }

  if (error || !trainerData) {
    console.log("Rendering error state:", { error, hasTrainerData: !!trainerData })
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Profile Not Available</h2>
            <p className="text-gray-600 mb-4 text-sm">{error || "Trainer profile not found or not activated"}</p>
            <p className="text-sm text-gray-500 mb-4">Trainer ID: {trainerId}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const content = trainerData.content

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Profile Not Ready</h2>
            <p className="text-gray-600 mb-4">This trainer profile is still being set up. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayName = trainerData.fullName || trainerData.name || "Trainer"

  // Ensure certifications is always an array
  const certifications = Array.isArray(trainerData.certifications)
    ? trainerData.certifications
    : typeof trainerData.certifications === "string"
      ? [trainerData.certifications]
      : ["Certified Personal Trainer"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Generated Website Preview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-lg border-0 bg-white">
          {/* Hero Section */}
          <div className="relative bg-[#D2FF28] text-black p-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.hero.title}</h1>
              <p className="text-xl mb-6">{content.hero.subtitle}</p>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Book Your Free Consultation
              </Button>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - About */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full"></div>
                    <h2 className="text-2xl font-bold">{content.about.title}</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{content.about.content}</p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-black" />
                      </div>
                      <span className="text-sm">{trainerData.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">Certified Professional</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Services Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">My Training Services</h2>
                  <div className="grid gap-4">
                    {content.services.map((service, index) => (
                      <Card key={index} className="p-6">
                        <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-lg font-bold text-[#D2FF28]">
                            <Euro className="h-4 w-4" />
                            {service.price.replace("€", "")}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            60 min
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Testimonials */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">What My Clients Say</h2>
                  <div className="space-y-6">
                    {content.testimonials.map((testimonial, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
                        <p className="text-sm text-gray-500">- {testimonial.name}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Contact & Info */}
              <div>
                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{content.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{content.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{content.contact.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-[#D2FF28] text-black hover:bg-[#C5F01A]">
                    Schedule Consultation
                  </Button>
                </Card>

                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Specialties</h3>
                  <div className="space-y-2">
                    <Badge className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">{trainerData.specialization}</Badge>
                  </div>

                  <h4 className="font-semibold mt-4 mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {certifications.map((cert, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {cert}
                      </p>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-[#D2FF28]">
                  <h3 className="text-xl font-bold mb-2 text-black">Ready to Start?</h3>
                  <p className="text-sm text-black mb-4">
                    Book your free consultation today and take the first step towards your fitness goals.
                  </p>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Contact Now</Button>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
