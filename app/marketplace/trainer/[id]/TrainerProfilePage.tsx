"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Star, Clock, Award, Dumbbell, CheckCircle } from "lucide-react"

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
  fullName: string
  email: string
  phone: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  content: TrainerContent
  isActive: boolean
  activatedAt: string
}

export default function TrainerProfilePage() {
  const params = useParams()
  const trainerId = params.id as string

  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (trainerId) {
      fetchTrainerData()
    }
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      console.log("Fetching trainer data for:", trainerId)

      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch trainer data")
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
        console.log("Trainer data loaded:", data.trainer.name)
      } else {
        throw new Error("Invalid trainer data received")
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError(error instanceof Error ? error.message : "Failed to load trainer profile")
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

  const { content } = trainer
  const displayName = trainer.fullName || trainer.name

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{content.hero.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{content.hero.subtitle}</p>
              <p className="text-lg text-gray-400 mb-8">{content.hero.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
                  Book a Session
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  View Programs
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-64 h-64 border-4 border-[#D2FF28]">
                  <AvatarImage src="/placeholder-user.jpg" alt={displayName} />
                  <AvatarFallback className="text-4xl bg-[#D2FF28] text-black">
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-4 -right-4 bg-[#D2FF28] text-black px-4 py-2 rounded-full font-semibold">
                  {trainer.experience}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
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
                <p className="text-gray-700 leading-relaxed mb-6">{content.about.content}</p>
                {trainer.certifications && trainer.certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#D2FF28]/10 text-black">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-[#D2FF28]" />
                  Training Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{service.title}</h4>
                        <span className="text-[#D2FF28] font-bold">{service.price}</span>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#D2FF28]" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-[#D2FF28] pl-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-2">"{testimonial.text}"</p>
                      <p className="font-semibold text-sm">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-center">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarImage src="/placeholder-user.jpg" alt={displayName} />
                    <AvatarFallback className="bg-[#D2FF28] text-black text-lg">
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{displayName}</h3>
                  <p className="text-gray-600">{trainer.specialization}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{content.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{content.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{content.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{content.contact.availability}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500">
                    Profile activated on {new Date(trainer.activatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
