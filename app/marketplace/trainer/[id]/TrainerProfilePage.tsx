"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Mail, Clock, Award } from "lucide-react"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  about: {
    title: string
    content: string
    image: string
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
  phone?: string
  location: string
  specialization: string
  experience: string
  bio?: string
  status: string
  isActive: boolean
  content?: TrainerContent
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch trainer data")
      }

      const data = await response.json()

      if (data.success) {
        setTrainer(data.trainer)
        setContent(data.content)
      } else {
        throw new Error(data.error || "Failed to load trainer")
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile could not be found."}</p>
          <Button onClick={() => (window.location.href = "/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  // If trainer is not active or has no content, show blocked message
  if (!trainer.isActive || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h1>
          <p className="text-gray-600 mb-4">This trainer profile is not currently active.</p>
          <Button onClick={() => (window.location.href = "/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  const displayName = trainer.fullName || trainer.name

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-8">{content.hero.subtitle}</p>
          <Button
            size="lg"
            className="bg-black text-[#D2FF28] hover:bg-gray-800 text-lg px-8 py-3"
            onClick={() => {
              const contactSection = document.getElementById("contact")
              contactSection?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {content.hero.cta}
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.about.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{content.about.content}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-[#D2FF28] text-black">
                  <MapPin className="h-3 w-3 mr-1" />
                  {trainer.location}
                </Badge>
                <Badge variant="secondary" className="bg-[#D2FF28] text-black">
                  <Clock className="h-3 w-3 mr-1" />
                  {trainer.experience}
                </Badge>
                <Badge variant="secondary" className="bg-[#D2FF28] text-black">
                  <Award className="h-3 w-3 mr-1" />
                  {trainer.specialization}
                </Badge>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={content.about.image || "/placeholder.svg"}
                alt={displayName}
                className="rounded-lg shadow-lg w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Services & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-[#D2FF28]">{service.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
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
      <section id="contact" className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Get in touch to book your free consultation</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-[#D2FF28]" />
              <span>{content.contact.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-[#D2FF28]" />
              <span>{content.contact.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-[#D2FF28]" />
              <span>{content.contact.location}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 text-lg px-8 py-3"
            onClick={() => (window.location.href = `mailto:${content.contact.email}`)}
          >
            Book Free Consultation
          </Button>
        </div>
      </section>
    </div>
  )
}
