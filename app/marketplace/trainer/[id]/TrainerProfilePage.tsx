"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Mail, Users, Award } from "lucide-react"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    cta: string
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
  }
}

interface TrainerData {
  id: string
  name: string
  fullName: string
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
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch trainer data")
      }

      const data = await response.json()

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
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const content = trainer.content
  const displayName = trainer.fullName || trainer.name

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Available</h1>
          <p className="text-gray-600 mb-4">This trainer profile is being set up.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{content.hero.title}</h1>
          <p className="text-xl text-black mb-8">{content.hero.subtitle}</p>
          <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800 text-lg px-8 py-3">
            {content.hero.cta}
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#D2FF28]" />
                  {content.about.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{content.about.content}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Certifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.about.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#D2FF28]" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.services.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{service.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <p className="font-semibold text-[#D2FF28]">{service.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle>What Clients Say</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-2">"{testimonial.text}"</p>
                      <p className="font-semibold text-sm">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#D2FF28]" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">{content.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#D2FF28]" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{content.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#D2FF28]" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">{content.contact.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-[#D2FF28] border-[#D2FF28]">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-black mb-2">Ready to Start?</h3>
                <p className="text-black text-sm mb-4">
                  Book your free consultation today and take the first step towards your fitness goals.
                </p>
                <Button className="w-full bg-black text-[#D2FF28] hover:bg-gray-800">Book Free Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
