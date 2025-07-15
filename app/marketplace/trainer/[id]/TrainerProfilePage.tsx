"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Star, Clock, Award } from "lucide-react"
import { logger } from "@/lib/logger"

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
  seo: {
    title: string
    description: string
    keywords: string[]
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
  content: TrainerContent | null
  isActive: boolean
  isPaid: boolean
  status: string
}

export default function TrainerProfilePage() {
  const params = useParams()
  const trainerId = params.id as string
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        logger.info("Fetching trainer profile", { trainerId })

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch trainer")
        }

        if (!data.success) {
          throw new Error(data.error || "Trainer not found")
        }

        setTrainer(data.trainer)
        logger.info("Trainer profile loaded successfully", { trainerId })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        logger.error("Failed to fetch trainer profile", { trainerId, error: errorMessage })
        setError(errorMessage)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-2">Profile Not Available</h2>
            <p className="text-gray-600 mb-4">
              {error || "This trainer profile could not be found or is not currently active."}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const content = trainer.content

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-white text-blue-600">
                {trainer.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {content?.hero.title || "Transform Your Body, Transform Your Life"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {content?.hero.subtitle || `${trainer.specialization} • ${trainer.experience} • ${trainer.location}`}
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            {content?.hero.cta || "Book Your Free Consultation"}
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {content?.about.title || `About ${trainer.fullName}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{content?.about.content || trainer.bio}</p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, index) => (
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
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {content?.services?.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{service.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      <p className="font-semibold text-blue-600">{service.price}</p>
                    </div>
                  )) || (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Personal Training</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        One-on-one training sessions tailored to your specific goals.
                      </p>
                      <p className="font-semibold text-blue-600">Contact for pricing</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            {content?.testimonials && content.testimonials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.testimonials.map((testimonial, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"{testimonial.text}"</p>
                        <p className="text-sm text-gray-500 mt-2">- {testimonial.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{trainer.location}</span>
                </div>
                {trainer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{trainer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{trainer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{trainer.experience}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Specialization</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="text-sm">
                  {trainer.specialization}
                </Badge>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-blue-50">
              <CardContent className="text-center p-6">
                <h3 className="font-semibold mb-2">Ready to Start?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Book your free consultation today and take the first step towards your fitness goals.
                </p>
                <Button className="w-full">Book Free Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
