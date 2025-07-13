"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Mail, Phone, Clock, Edit, User, Award, Calendar } from "lucide-react"
import Link from "next/link"
import type { TrainerData } from "@/types/trainer"
import { logger } from "@/lib/logger"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTrainer() {
      try {
        setLoading(true)
        logger.info("Loading trainer profile", { trainerId })

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        if (!response.ok) {
          throw new Error(`Failed to load trainer: ${response.statusText}`)
        }

        const data = await response.json()
        setTrainer(data.trainer)

        logger.info("Trainer profile loaded successfully", { trainerId })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load trainer"
        setError(errorMessage)
        logger.error("Failed to load trainer profile", { trainerId, error: errorMessage })
      } finally {
        setLoading(false)
      }
    }

    if (trainerId) {
      loadTrainer()
    }
  }, [trainerId])

  if (loading) {
    return <TrainerProfileSkeleton />
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || "Trainer not found"}</p>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use custom content if available, otherwise fall back to original data
  const content = trainer.content
  const heroTitle = content?.hero?.title || `Professional ${trainer.specialization} Trainer`
  const heroSubtitle = content?.hero?.subtitle || `${trainer.name} - ${trainer.experience} Experience`
  const heroDescription =
    content?.hero?.description || `Located in ${trainer.location}, specializing in ${trainer.specialization}`

  const aboutTitle = content?.about?.title || "About Me"
  const aboutContent =
    content?.about?.content ||
    `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping people achieve their fitness goals through personalized training programs.`

  const services = content?.services || [
    {
      id: "1",
      title: "Personal Training",
      description: "One-on-one personalized training sessions",
      price: "€75",
      duration: "60 minutes",
    },
    {
      id: "2",
      title: "Nutrition Consultation",
      description: "Comprehensive nutrition planning and guidance",
      price: "€50",
      duration: "45 minutes",
    },
  ]

  const contactTitle = content?.contact?.title || "Get Started Today"
  const contactDescription =
    content?.contact?.description || "Ready to begin your fitness journey? Contact me to schedule your first session."
  const contactEmail = content?.contact?.email || trainer.email
  const contactPhone = content?.contact?.phone || trainer.phone || ""
  const contactLocation = content?.contact?.location || trainer.location
  const contactAvailability = content?.contact?.availability || "Monday - Friday: 6:00 AM - 8:00 PM"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{heroTitle}</h1>
            <p className="text-xl md:text-2xl mb-6 text-orange-100">{heroSubtitle}</p>
            <p className="text-lg mb-8 text-orange-100 max-w-2xl mx-auto">{heroDescription}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {trainer.specialization}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                {trainer.experience}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                {trainer.location}
              </Badge>
            </div>
            {trainer.status === "active" && (
              <div className="mt-8">
                <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                  <Button size="lg" variant="secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* About Section */}
        <section>
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{aboutTitle}</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {aboutContent.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Services Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-xl text-gray-600">Professional training services tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <Badge variant="outline" className="text-lg font-bold text-orange-600">
                      {service.price}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{contactTitle}</h2>
                <p className="text-xl text-gray-600">{contactDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${contactEmail}`} className="text-orange-600 hover:text-orange-700">
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  {contactPhone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href={`tel:${contactPhone}`} className="text-orange-600 hover:text-orange-700">
                          {contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{contactLocation}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Availability</p>
                      <div className="text-gray-600 space-y-1">
                        {contactAvailability.split("\n").map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="text-center">
                <Button size="lg" asChild>
                  <a href={`mailto:${contactEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Me
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

function TrainerProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center space-y-6">
            <Skeleton className="w-32 h-32 rounded-full mx-auto bg-white/20" />
            <Skeleton className="h-12 w-96 mx-auto bg-white/20" />
            <Skeleton className="h-6 w-64 mx-auto bg-white/20" />
            <Skeleton className="h-4 w-80 mx-auto bg-white/20" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-8 w-24 bg-white/20" />
              <Skeleton className="h-8 w-24 bg-white/20" />
              <Skeleton className="h-8 w-24 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* About Skeleton */}
        <Card>
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>

        {/* Services Skeleton */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Skeleton */}
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
