"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Euro, Edit, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Trainer } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainer()
  }, [trainerId])

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainer(data)
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg">Trainer not found</div>
      </div>
    )
  }

  // Use edited content if available, otherwise fall back to original data
  const heroTitle = trainer.content?.heroTitle || `${trainer.firstName} ${trainer.lastName}`
  const heroSubtitle = trainer.content?.heroSubtitle || `Professional ${trainer.specialization} Trainer`
  const aboutTitle = trainer.content?.aboutTitle || "About Me"
  const aboutContent =
    trainer.content?.aboutContent ||
    trainer.bio ||
    "Passionate fitness professional dedicated to helping you achieve your goals."
  const services = trainer.content?.services || []
  const contactTitle = trainer.content?.contactTitle || "Get in Touch"
  const contactContent = trainer.content?.contactContent || "Ready to start your fitness journey? Contact me today!"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{heroTitle}</h1>
                <p className="text-xl text-blue-100 mb-4">{heroSubtitle}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trainer.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trainer.experience} years experience
                  </div>
                </div>
              </div>
              {trainer.status === "active" && (
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                  className="ml-4"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">{aboutTitle}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutContent}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            {services.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Services</h2>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{service.title}</h3>
                          <div className="flex items-center gap-2">
                            {service.price && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Euro className="w-3 h-3" />
                                {service.price}
                              </Badge>
                            )}
                            {service.duration && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Section */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">{contactTitle}</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{contactContent}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trainer Info */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trainer Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Specialization</span>
                    <p className="font-medium">{trainer.specialization}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">Experience</span>
                    <p className="font-medium">{trainer.experience} years</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="font-medium">{trainer.location}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">Certifications</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trainer.certifications?.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <Badge variant={trainer.status === "active" ? "default" : "secondary"} className="capitalize">
                  {trainer.status}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
