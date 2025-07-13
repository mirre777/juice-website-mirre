"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Euro, Mail, Phone, Edit, Calendar, Award, Users } from "lucide-react"
import Link from "next/link"
import type { TrainerData, TrainerContent } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainer(data.trainer)
        setContent(data.content)
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-juice/5 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juice"></div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-juice/5 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Use custom content if available, otherwise fall back to original data
  const heroTitle = content?.hero?.title || `Professional ${trainer.specialization} Training with ${trainer.name}`
  const heroSubtitle = content?.hero?.subtitle || `${trainer.experience} Years of Experience`
  const heroDescription =
    content?.hero?.description ||
    `Transform your fitness journey with personalized training from ${trainer.name}. Based in ${trainer.location}, offering professional ${trainer.specialization} services.`

  const aboutTitle = content?.about?.title || "About Me"
  const aboutContent =
    content?.about?.content ||
    `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} years of experience. I'm passionate about helping people achieve their fitness goals through personalized training programs.`

  const services = content?.services || [
    {
      id: "1",
      title: "Personal Training Session",
      description: "One-on-one personalized training session",
      price: "€60",
      duration: "60 minutes",
    },
  ]

  const contactTitle = content?.contact?.title || "Get Started Today"
  const contactDescription =
    content?.contact?.description ||
    "Ready to begin your fitness transformation? Contact me to schedule your first session."
  const contactEmail = content?.contact?.email || trainer.email
  const contactPhone = content?.contact?.phone || trainer.phone || ""
  const availability = content?.contact?.availability || "Contact me for availability"

  return (
    <div className="min-h-screen bg-gradient-to-br from-juice/5 to-orange-50">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{heroTitle}</h1>
            <p className="text-xl text-gray-600 mb-2">{heroSubtitle}</p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">{heroDescription}</p>
          </div>

          {/* Trainer Card */}
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-juice to-orange-400 flex items-center justify-center">
                    <div className="w-44 h-44 rounded-xl bg-white flex items-center justify-center">
                      <Users className="h-20 w-20 text-juice" />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{trainer.name}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-juice/10 text-juice">
                          {trainer.specialization}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trainer.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {trainer.experience} years
                        </Badge>
                      </div>
                    </div>

                    {trainer.status === "active" && (
                      <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Content
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-juice">{trainer.experience}</div>
                      <div className="text-sm text-gray-600">Years Exp.</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-juice">4.9</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-juice">100+</div>
                      <div className="text-sm text-gray-600">Clients</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-juice">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-juice hover:bg-juice/90">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Now
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{aboutTitle}</h3>
                <div className="prose prose-gray max-w-none">
                  {aboutContent.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h3>
                <div className="space-y-6">
                  {services.map((service, index) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{service.title}</h4>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            {service.price}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{contactTitle}</h3>
                <p className="text-gray-600 mb-6">{contactDescription}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-juice" />
                    <a href={`mailto:${contactEmail}`} className="text-gray-700 hover:text-juice">
                      {contactEmail}
                    </a>
                  </div>
                  {contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-juice" />
                      <a href={`tel:${contactPhone}`} className="text-gray-700 hover:text-juice">
                        {contactPhone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-juice mt-1" />
                    <div className="text-gray-700">
                      {availability.split("\n").map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <Button className="w-full bg-juice hover:bg-juice/90">
                  <Mail className="h-4 w-4 mr-2" />
                  Get Started Today
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-juice" />
                  <span className="text-gray-700">{trainer.location}</span>
                </div>
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-gray-500">Map placeholder</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
