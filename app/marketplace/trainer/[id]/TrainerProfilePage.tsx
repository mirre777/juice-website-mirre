"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Phone, Mail } from "lucide-react"

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location?: string
  specialty?: string
  experience?: string
  bio?: string
  services?: Array<{
    name: string
    description: string
  }>
  content?: {
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
      name: string
      description: string
    }>
    contact: {
      email: string
      phone?: string
      location?: string
    }
    testimonials: Array<{
      name: string
      text: string
      rating: number
    }>
  }
  status: string
  isActive: boolean
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrainer() {
      try {
        console.log("Fetching trainer data for:", trainerId)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch trainer")
        }

        console.log("Trainer data received:", data)
        setTrainer(data.trainer)
      } catch (err) {
        console.error("Error fetching trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer")
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Blocked</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile is not available."}</p>
          <p className="text-sm text-gray-500">Contact the site owner to fix this issue.</p>
        </div>
      </div>
    )
  }

  const content = trainer.content

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-juice to-yellow-400 text-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {content?.hero?.title || "Transform Your Body, Transform Your Life"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {content?.hero?.subtitle || `${trainer.specialty} • ${trainer.experience} • ${trainer.location}`}
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            {content?.hero?.cta || "Book Your Free Consultation"}
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              {content?.about?.title || `About ${trainer.fullName}`}
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {content?.about?.content ||
                  trainer.bio ||
                  "Dedicated fitness professional committed to helping you achieve your goals."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(content?.services || trainer.services || []).map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {content?.testimonials && content.testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {content.testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get Started Today</h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {trainer.email && (
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>{trainer.email}</span>
                </div>
              )}
              {trainer.phone && (
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>{trainer.phone}</span>
                </div>
              )}
              {trainer.location && (
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{trainer.location}</span>
                </div>
              )}
            </div>
            <Button size="lg" className="bg-juice text-black hover:bg-yellow-400">
              Book Your Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
