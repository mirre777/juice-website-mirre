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
  email?: string
  phone?: string
  location?: string
  specialization?: string
  experience?: string
  services?: string[]
  isActive: boolean
  status: string
  content: TrainerContent
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    async function fetchTrainerContent() {
      try {
        console.log("=== TRAINER PROFILE PAGE INIT ===")
        console.log("Trainer ID provided:", trainerId)

        if (!trainerId) {
          console.error("No trainer ID provided")
          setError("No trainer ID provided")
          setLoading(false)
          return
        }

        console.log("=== TRAINER PROFILE PAGE DEBUG ===")
        console.log("1. Starting fetch for trainer ID:", trainerId)
        console.log("2. Current URL:", window.location.href)
        console.log("3. Making API call to:", `/api/trainer/content/${trainerId}`)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        console.log("4. API Response status:", response.status)
        console.log("5. API Response ok:", response.ok)
        console.log("6. Response content-type:", response.headers.get("content-type"))

        if (!response.ok) {
          const errorText = await response.text()
          console.log("7. Error response text:", errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log("8. JSON response parsed successfully:", data)

        if (data.success && data.trainer) {
          console.log("9. Trainer data received:", {
            id: data.trainer.id,
            name: data.trainer.name,
            isActive: data.trainer.isActive,
            hasContent: !!data.trainer.content,
          })
          setTrainer(data.trainer)
        } else {
          console.error("10. API returned unsuccessful response:", data)
          setError(data.error || "Failed to load trainer data")
        }
      } catch (err) {
        console.error("11. Error in fetchTrainerContent:", err)
        console.error("12. Error details:", err instanceof Error ? err.message : "Unknown error")
        setError(err instanceof Error ? err.message : "Failed to load trainer data")
      } finally {
        console.log("13. Setting loading to false")
        setLoading(false)
      }
    }

    fetchTrainerContent()
  }, [trainerId])

  if (loading) {
    console.log("Rendering loading state for trainer:", trainerId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2FF28] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    console.log("Rendering error state:", { error, hasTrainerData: !!trainer })
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Profile Not Available</h1>
            <p className="text-gray-600 mb-4">{error || "Trainer not found"}</p>
            {trainerId && <p className="text-sm text-gray-500 mb-4">Trainer ID: {trainerId}</p>}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#D2FF28] hover:bg-[#B8E625] text-black font-medium"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { content } = trainer

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bright Green Background */}
      <div className="bg-[#D2FF28] px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl text-black mb-6">{content.hero.subtitle}</p>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-medium rounded-lg">
            Book Your Free Consultation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">👤</span>
                  </div>
                  <h2 className="text-2xl font-bold">{content.about.title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{content.about.content}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#D2FF28]" />
                    <span className="text-sm font-medium">{trainer.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#D2FF28]" />
                    <span className="text-sm font-medium">Certified Professional</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">My Training Services</h2>
                <div className="space-y-4">
                  {content.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <div className="flex items-center gap-1 text-[#D2FF28] font-bold">
                          <Euro className="w-4 h-4" />
                          <span>{service.price.replace("€", "")}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>60 min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
                <div className="space-y-4">
                  {content.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-[#D2FF28] pl-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#D2FF28] text-[#D2FF28]" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                      <p className="font-medium text-sm">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info & Specialties */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{content.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{content.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{content.contact.location}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button className="w-full bg-[#D2FF28] hover:bg-[#B8E625] text-black font-medium">
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#D2FF28] text-black hover:bg-[#B8E625]">{trainer.specialization}</Badge>
                  {trainer.services?.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Availability</h2>
                <p className="text-sm text-gray-600">{content.contact.availability}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
