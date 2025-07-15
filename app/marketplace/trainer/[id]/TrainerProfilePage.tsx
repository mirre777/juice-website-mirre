"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Mail, Phone, CheckCircle } from "lucide-react"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
    certifications: string[]
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
  }
}

interface TrainerData {
  id: string
  name: string
  fullName?: string
  email: string
  location: string
  specialization: string
  experience: string
  status: string
  isActive: boolean
  content?: TrainerContent
}

export default function TrainerProfilePage() {
  const params = useParams()
  const trainerId = params.id as string

  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerContent = async () => {
      try {
        console.log("Fetching trainer content for:", trainerId)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        const data = await response.json()

        console.log("API response:", data)

        if (data.success && data.trainer && data.content) {
          setTrainer(data.trainer)
          setContent(data.content)
        } else {
          setError(data.error || "Trainer profile not found or not activated")
        }
      } catch (error: any) {
        console.error("Error fetching trainer:", error)
        setError("Failed to load trainer profile")
      } finally {
        setLoading(false)
      }
    }

    if (trainerId) {
      fetchTrainerContent()
    }
  }, [trainerId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-gray-400">📄</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Blocked</h1>
          <p className="text-gray-600 mb-4">
            {error || "This trainer profile is not activated or content is not available."}
          </p>
          <p className="text-sm text-gray-500">Contact the site owner to fix this issue.</p>
        </div>
      </div>
    )
  }

  const displayName = trainer.fullName || trainer.name

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#D2FF28] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-6">{content.hero.subtitle}</p>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
          <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800">
            Book Your Free Consultation
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">👤</span>
              </div>
              {content.about.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{content.about.content}</p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Certifications:</h4>
              <div className="flex flex-wrap gap-2">
                {content.about.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#D2FF28] text-black">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-[#D2FF28]">{service.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Client Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.testimonials.map((testimonial, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D2FF28]" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">{content.contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D2FF28]" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">{content.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#D2FF28]" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-600">{content.contact.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
                Get Started Today
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
