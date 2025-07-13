"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Edit, Euro, Clock } from "lucide-react"
import Link from "next/link"
import type { TrainerData } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Trainer Not Found</h2>
            <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use edited content if available, fallback to original form data
  const heroTitle = trainer.heroTitle || `${trainer.firstName} ${trainer.lastName}`
  const heroSubtitle = trainer.heroSubtitle || `Professional ${trainer.specialization} Trainer`
  const aboutTitle = trainer.aboutTitle || "About Me"
  const aboutContent =
    trainer.aboutContent ||
    `Hi, I'm ${trainer.firstName}! I'm a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping people achieve their fitness goals and live healthier lives.`
  const contactTitle = trainer.contactTitle || "Get In Touch"
  const contactContent =
    trainer.contactContent || "Ready to start your fitness journey? Contact me to schedule your first session!"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Floating Card Design */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 relative">
            <div className="absolute top-4 right-4">
              {trainer.status === "active" && (
                <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                </Link>
              )}
            </div>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-6">{heroSubtitle}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {trainer.specialization}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {trainer.experience} Experience
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {trainer.location}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {/* About Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{aboutTitle}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutContent}</p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Services Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainer.services && trainer.services.length > 0 ? (
                  trainer.services.map((service) => (
                    <Card key={service.id} className="border-2 hover:border-blue-300 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600">
                            <Euro className="w-4 h-4 mr-1" />
                            <span className="font-semibold">{service.price}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  // Default services if none are customized
                  <>
                    <Card className="border-2 hover:border-blue-300 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Training Session</h3>
                        <p className="text-gray-600 mb-4">
                          One-on-one personalized training session tailored to your fitness goals.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600">
                            <Euro className="w-4 h-4 mr-1" />
                            <span className="font-semibold">60</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>60 minutes</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 hover:border-blue-300 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation</h3>
                        <p className="text-gray-600 mb-4">
                          Initial consultation to discuss your goals and create a personalized plan.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600">
                            <Euro className="w-4 h-4 mr-1" />
                            <span className="font-semibold">30</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>30 minutes</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </section>

            <Separator className="my-8" />

            {/* Contact Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{contactTitle}</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-6 whitespace-pre-line">{contactContent}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{trainer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{trainer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{trainer.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact {trainer.firstName}
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
