"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Clock, Euro, Mail, Phone } from "lucide-react"
import Link from "next/link"
import type { Trainer } from "@/types/trainer"
import { logger } from "@/lib/logger"

interface TrainerProfilePageProps {
  trainerId: string
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrainer()
  }, [trainerId])

  const loadTrainer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (response.ok) {
        const data = await response.json()
        setTrainer(data)
        logger.info("Trainer profile loaded", { trainerId })
      } else {
        logger.error("Failed to load trainer profile", { trainerId, status: response.status })
      }
    } catch (error) {
      logger.error("Error loading trainer profile", { error, trainerId })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Use edited content if available, otherwise fall back to original form data
  const heroTitle = trainer.content?.heroTitle || `${trainer.firstName} ${trainer.lastName}`
  const heroSubtitle = trainer.content?.heroSubtitle || `Professional ${trainer.specialization} Trainer`
  const aboutTitle = trainer.content?.aboutTitle || "About Me"
  const aboutContent =
    trainer.content?.aboutContent ||
    `Hi, I'm ${trainer.firstName}! I'm a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping people achieve their fitness goals through personalized training programs.`
  const contactTitle = trainer.content?.contactTitle || "Get In Touch"
  const contactContent =
    trainer.content?.contactContent || `Ready to start your fitness journey? Contact me to schedule your first session!`
  const services = trainer.content?.services || [
    {
      id: "default_1",
      title: "Personal Training Session",
      description: "One-on-one personalized training session",
      price: 60,
      duration: "60 minutes",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Edit Button for Active Trainers */}
          {trainer.status === "active" && (
            <div className="mb-6 text-right">
              <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              </Link>
            </div>
          )}

          {/* Hero Section */}
          <Card className="mb-8 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                  {trainer.firstName[0]}
                  {trainer.lastName[0]}
                </div>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl font-bold mb-2">{heroTitle}</h1>
                  <p className="text-xl text-blue-100 mb-4">{heroSubtitle}</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <MapPin className="h-3 w-3 mr-1" />
                      {trainer.location}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {trainer.specialization}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {trainer.experience} experience
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{aboutTitle}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aboutContent}</p>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                        <div className="flex items-center text-lg font-semibold text-green-600">
                          <Euro className="h-4 w-4 mr-1" />
                          {service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{contactTitle}</h2>
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contactContent}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{trainer.email}</p>
                  </div>
                </div>

                {trainer.phone && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{trainer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
