"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Edit, Star, Clock, Euro } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Trainer } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
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
        <div className="animate-pulse">
          <div className="w-96 h-96 bg-white rounded-2xl shadow-xl"></div>
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
    `Experienced ${trainer.specialization.toLowerCase()} trainer with ${trainer.experience} of experience. Passionate about helping clients achieve their fitness goals through personalized training programs.`
  const contactTitle = trainer.content?.contactTitle || "Get In Touch"
  const contactMessage =
    trainer.content?.contactMessage || "Ready to start your fitness journey? Contact me to schedule your first session!"

  // Use custom services if available, otherwise create default services
  const services =
    trainer.content?.services && trainer.content.services.length > 0
      ? trainer.content.services
      : [
          {
            id: "1",
            title: "Personal Training Session",
            description: "One-on-one personalized training session",
            price: 60,
            duration: "60 minutes",
          },
          {
            id: "2",
            title: "Fitness Assessment",
            description: "Comprehensive fitness evaluation and goal setting",
            price: 40,
            duration: "45 minutes",
          },
        ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Edit Button for Active Trainers */}
        {trainer.status === "active" && (
          <div className="mb-6 flex justify-end">
            <Link href={`/marketplace/trainer/${trainerId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Content
              </Button>
            </Link>
          </div>
        )}

        {/* Floating Card Design */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                    <Image
                      src="/placeholder-user.jpg"
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {trainer.status === "active" && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{heroTitle}</h1>
                  <p className="text-xl text-blue-100 mb-4">{heroSubtitle}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {trainer.specialization}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {trainer.experience} Experience
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trainer.location}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              {/* About Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{aboutTitle}</h2>
                <p className="text-gray-600 leading-relaxed">{aboutContent}</p>
              </section>

              <Separator />

              {/* Services Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{service.title}</h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              <Euro className="w-4 h-4 inline mr-1" />
                              {service.price}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Contact Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{contactTitle}</h2>
                <p className="text-gray-600 mb-6">{contactMessage}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{trainer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{trainer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
