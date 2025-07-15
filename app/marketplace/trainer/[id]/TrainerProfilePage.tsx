"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Mail, Phone, Star, Clock, Award, Dumbbell, Users, CheckCircle } from "lucide-react"

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

interface Trainer {
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
  content: TrainerContent
  isActive: boolean
  activatedAt: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainerContent()
  }, [trainerId])

  const fetchTrainerContent = async () => {
    try {
      console.log("Fetching content for trainer:", trainerId)

      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Trainer not found")
        }
        throw new Error("Failed to load trainer profile")
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
        console.log("Trainer content loaded:", data.trainer.name)
      } else {
        throw new Error("Invalid trainer data")
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

  const displayName = trainer.fullName || trainer.name

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-[#D2FF28] text-black text-2xl font-bold">
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
                  <p className="text-xl text-gray-300 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {trainer.specialization}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {trainer.location}
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">{trainer.content.hero.title}</h2>
              <p className="text-xl text-gray-300 mb-6">{trainer.content.hero.description}</p>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">Book Session</Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  View Programs
                </Button>
              </div>
            </div>

            <div className="lg:text-right">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-[#D2FF28]" />
                  <span className="font-semibold">Experience</span>
                </div>
                <p className="text-2xl font-bold text-[#D2FF28]">{trainer.experience}</p>
                <p className="text-gray-300 mt-2">of professional training</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {trainer.content.about.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.content.about.content}</p>

                {trainer.certifications && trainer.certifications.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#D2FF28]/20 text-black">
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
                  <Dumbbell className="h-5 w-5" />
                  Training Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {trainer.content.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{service.title}</h4>
                        <span className="text-xl font-bold text-[#D2FF28]">{service.price}</span>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      <Button className="mt-3 bg-black text-white hover:bg-gray-800">Learn More</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {trainer.content.testimonials.map((testimonial, index) => (
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
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${trainer.content.contact.email}`} className="text-blue-600 hover:underline">
                      {trainer.content.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${trainer.content.contact.phone}`} className="text-blue-600 hover:underline">
                      {trainer.content.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{trainer.content.contact.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-gray-600">{trainer.content.contact.availability}</p>
                  </div>
                </div>

                <Button className="w-full bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 mt-6">Book Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
