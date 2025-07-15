"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    certifications: string[]
  }
  services: Array<{
    name: string
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

interface Trainer {
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
  status: string
  isActive: boolean
  isPaid: boolean
  content: TrainerContent
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
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
        throw new Error(`Failed to fetch trainer: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile could not be found."}</p>
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
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-6">{content.hero.subtitle}</p>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">{content.hero.description}</p>
          <Button
            size="lg"
            className="bg-black text-[#D2FF28] hover:bg-gray-800 text-lg px-8 py-3"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book Your Free Consultation
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">💪</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.about.title}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{content.about.content}</p>
              <div className="space-y-3">
                {content.about.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{content.contact.location}</span>
                </div>
                {content.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{content.contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{content.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{content.contact.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-lg text-gray-600">Choose the training option that works best for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-[#D2FF28] transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-lg text-gray-600">Real results from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-[#D2FF28]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-lg text-black/80 mb-8">
            Book your free consultation today and take the first step towards your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-black text-[#D2FF28] hover:bg-gray-800"
              onClick={() =>
                (window.location.href = `mailto:${content.contact.email}?subject=Free Consultation Request`)
              }
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Email
            </Button>
            {content.contact.phone && (
              <Button
                size="lg"
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-[#D2FF28] bg-transparent"
                onClick={() => (window.location.href = `tel:${content.contact.phone}`)}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
