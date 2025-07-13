"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Mail, Phone, MapPin, Star, Clock, Euro } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
}

interface TrainerContent {
  heroTitle?: string
  heroSubtitle?: string
  aboutTitle?: string
  aboutContent?: string
  services?: Service[]
  contactEmail?: string
  contactPhone?: string
  contactLocation?: string
}

interface Trainer {
  id: string
  name: string
  email: string
  specialization: string
  experience: string
  location: string
  bio: string
  status: "active" | "pending" | "inactive"
  content?: TrainerContent
  createdAt: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/content/${trainerId}`)
        if (response.ok) {
          const data = await response.json()
          setTrainer(data.trainer)
        }
      } catch (error) {
        console.error("Error loading trainer:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrainer()
  }, [trainerId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
        </Card>
      </div>
    )
  }

  // Use custom content if available, otherwise fall back to original data
  const content = trainer.content || {}
  const heroTitle = content.heroTitle || `${trainer.name} - ${trainer.specialization}`
  const heroSubtitle = content.heroSubtitle || `${trainer.experience} of experience in ${trainer.location}`
  const aboutTitle = content.aboutTitle || "About Me"
  const aboutContent = content.aboutContent || trainer.bio
  const services = content.services || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {trainer.name.charAt(0)}
                  </div>
                  {trainer.status === "active" && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{heroTitle}</h1>
                  <p className="text-xl text-gray-600 mb-4">{heroSubtitle}</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    <Badge variant="secondary">{trainer.specialization}</Badge>
                    <Badge variant="outline">{trainer.experience}</Badge>
                    <Badge variant="outline">{trainer.location}</Badge>
                  </div>

                  {trainer.status === "active" && (
                    <div className="flex gap-2 justify-center md:justify-start">
                      <Link href={`/marketplace/trainer/${trainer.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Content
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{aboutTitle}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutContent}</p>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            {services.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                  <div className="space-y-6">
                    {services.map((service, index) => (
                      <div key={service.id}>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {service.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {service.duration}
                                </div>
                              )}
                              {service.price && (
                                <div className="flex items-center gap-1">
                                  <Euro className="h-4 w-4" />
                                  {service.price}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < services.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

                <div className="space-y-4">
                  {(content.contactEmail || trainer.email) && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a
                        href={`mailto:${content.contactEmail || trainer.email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {content.contactEmail || trainer.email}
                      </a>
                    </div>
                  )}

                  {content.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <a
                        href={`tel:${content.contactPhone}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {content.contactPhone}
                      </a>
                    </div>
                  )}

                  {(content.contactLocation || trainer.location) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{content.contactLocation || trainer.location}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <Button className="w-full" size="lg">
                  Get In Touch
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
