"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"

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
    phone: string
    email: string
    location: string
    availability: string
  }
}

interface TrainerData {
  id: string
  name: string
  fullName: string
  email: string
  phone: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  services: string[]
  content: TrainerContent
  isActive: boolean
  isPaid: boolean
  status: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        console.log("Fetching trainer data for ID:", trainerId)
        const response = await fetch(`/api/trainer/content/${trainerId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch trainer data")
        }

        const data = await response.json()
        console.log("Trainer data received:", data)

        if (data.success && data.trainer) {
          setTrainer(data.trainer)
        } else {
          throw new Error("Invalid trainer data")
        }
      } catch (error: any) {
        console.error("Error fetching trainer:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (trainerId) {
      fetchTrainer()
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

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl">📄</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Blocked</h1>
          <p className="text-gray-600 mb-4">
            {error || "This trainer profile is not available or has not been activated yet."}
          </p>
          <Button onClick={() => (window.location.href = "/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  const { content } = trainer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-6">{content.hero.subtitle}</p>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
          <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800">
            Book Your Free Consultation
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.about.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{content.about.content}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">{trainer.specialization}</Badge>
                <Badge variant="secondary">{trainer.experience}</Badge>
                <Badge variant="secondary">{trainer.location}</Badge>
              </div>
              <div className="space-y-2">
                {trainer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-6xl">👨‍💼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Services & Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-lg font-semibold text-[#D2FF28]">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Client Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#D2FF28]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-8">Ready to Start Your Transformation?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-black" />
              <span className="text-black">{content.contact.location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-black" />
              <span className="text-black">{content.contact.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-black" />
              <span className="text-black">{content.contact.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-black" />
              <span className="text-black text-sm">{content.contact.availability}</span>
            </div>
          </div>
          <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800">
            Book Your Free Consultation
          </Button>
        </div>
      </section>
    </div>
  )
}
