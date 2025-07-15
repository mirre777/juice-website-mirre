"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Mail, Phone, Calendar } from "lucide-react"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    cta: string
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
  }
}

interface Trainer {
  id: string
  name: string
  fullName: string
  email: string
  specialization: string
  experience: string
  location: string
  bio: string
  content: TrainerContent
  isActive: boolean
  status: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      console.log("Fetching trainer data for:", trainerId)

      const response = await fetch(`/api/trainer/content/${trainerId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch trainer data")
      }

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error("Invalid trainer data")
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError(error instanceof Error ? error.message : "Failed to load trainer")
    } finally {
      setLoading(false)
    }
  }

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

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h1>
          <p className="text-gray-600 mb-4">{error || "Trainer profile not found"}</p>
          <Button onClick={() => (window.location.href = "/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  const { content } = trainer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-8">{content.hero.subtitle}</p>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            {content.hero.cta}
          </Button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              {content.about.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{content.about.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">{trainer.specialization}</Badge>
              <Badge variant="secondary">{trainer.experience}</Badge>
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                {trainer.location}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services & Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D2FF28]">{service.price}</span>
                    <Button size="sm">Book Now</Button>
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                  <p className="font-semibold text-sm">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Get In Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#D2FF28]" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-gray-600">{content.contact.email}</p>
                </div>
              </div>
              {content.contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#D2FF28]" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-gray-600">{content.contact.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#D2FF28]" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-sm text-gray-600">{content.contact.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#c5f016]">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
