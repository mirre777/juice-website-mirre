"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Users, Award, Phone, Mail, Globe, Calendar } from "lucide-react"

interface TempTrainerData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  specialties: string[]
  experience: string
  certifications: string[]
  pricing: string
  availability: string
  bio: string
  services: string[]
  website?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  content?: {
    heroTitle?: string
    heroSubtitle?: string
    aboutSection?: string
    servicesSection?: string
    testimonialsSection?: string
    contactSection?: string
  }
}

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch trainer data")
        }
        const data = await response.json()
        setTrainer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTrainerData()
    }
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-black rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "Trainer profile not found"}</p>
          <a
            href="/marketplace/personal-trainer-website"
            className="inline-flex items-center px-4 py-2 bg-[#D2FF28] text-black rounded-lg hover:bg-[#D2FF28]/90"
          >
            Return to Form
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D2FF28] to-[#B8E620] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              {trainer.content?.heroTitle || `${trainer.name}`}
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-8 max-w-3xl mx-auto">
              {trainer.content?.heroSubtitle || "Professional Personal Trainer"}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trainer.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-black text-white px-4 py-2">
                  {specialty}
                </Badge>
              ))}
            </div>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              <Calendar className="mr-2 h-5 w-5" />
              Book a Session
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {trainer.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{trainer.content?.aboutSection || trainer.bio}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#D2FF28] mr-2" />
                  <span className="text-sm text-gray-600">{trainer.experience} Experience</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-[#D2FF28] mr-2" />
                  <span className="text-sm text-gray-600">{trainer.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-[#D2FF28] mr-2" />
                  <span className="text-sm text-gray-600">{trainer.pricing}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-[#D2FF28] mr-2" />
                  <span className="text-sm text-gray-600">{trainer.availability}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-2">
                {trainer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="h-4 w-4 text-[#D2FF28] mr-2" />
                    <span className="text-gray-600">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {trainer.content?.servicesSection || "Professional training services tailored to your goals"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainer.services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 text-[#D2FF28] mr-2" />
                    {service}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Professional {service.toLowerCase()} training sessions.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {trainer.content?.contactSection || "Ready to start your fitness journey? Contact me today!"}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-[#D2FF28] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">{trainer.phone}</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-[#D2FF28] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{trainer.email}</p>
              </CardContent>
            </Card>
            {trainer.website && (
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  <Globe className="h-8 w-8 text-[#D2FF28] mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                  <a href={trainer.website} className="text-[#D2FF28] hover:underline">
                    Visit Website
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Take the first step towards your fitness goals. Book a consultation today!
          </p>
          <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Consultation
          </Button>
        </div>
      </section>
    </div>
  )
}
