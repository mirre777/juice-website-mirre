"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Mail, Phone, Clock, Euro, Edit, ExternalLink, Award, Target } from "lucide-react"
import type { TrainerProfile } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainer()
  }, [trainerId])

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch trainer")
      }
      const data = await response.json()
      setTrainer(data.trainer)
    } catch (error) {
      console.error("Error fetching trainer:", error)
      toast({
        title: "Error",
        description: "Failed to load trainer profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600 mb-4">The trainer profile you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  // Use edited content if available, otherwise fall back to original data
  const content = trainer.content
  const heroTitle = content?.hero?.title || `Professional Training with ${trainer.name}`
  const heroSubtitle = content?.hero?.subtitle || `${trainer.specialization} • ${trainer.experience} Experience`
  const heroDescription =
    content?.hero?.description ||
    `Get personalized fitness training with ${trainer.name} in ${trainer.location}. Specializing in ${trainer.specialization} with ${trainer.experience} of experience.`

  const aboutTitle = content?.about?.title || "About Me"
  const aboutContent =
    content?.about?.content ||
    `I'm ${trainer.name}, a certified personal trainer with ${trainer.experience} of experience in ${trainer.specialization}. I'm passionate about helping clients achieve their fitness goals through personalized training programs.`

  const services = content?.services || [
    {
      id: "1",
      title: "Personal Training Session",
      description: "One-on-one personalized training session",
      price: 60,
      duration: "60 minutes",
      featured: true,
    },
  ]

  const contactTitle = content?.contact?.title || "Get Started Today"
  const contactDescription =
    content?.contact?.description || "Ready to begin your fitness journey? Contact me to schedule your first session."
  const contactPhone = content?.contact?.phone || trainer.phone

  const seoTitle = content?.seo?.title || `${trainer.name} - Personal Trainer`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Profile Card */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            {/* Header with Edit Button */}
            {trainer.status === "active" && (
              <div className="absolute top-4 right-4 z-10">
                <Button
                  onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                  size="sm"
                  className="bg-white/90 text-gray-700 hover:bg-white border shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              </div>
            )}

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                    {trainer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{heroTitle}</h1>
                    <p className="text-xl text-blue-100 mb-3">{heroSubtitle}</p>
                    <p className="text-blue-50 leading-relaxed max-w-2xl">{heroDescription}</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <CardContent className="p-8">
              {/* Trainer Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trainer.location}</p>
                    <p className="text-sm text-gray-600">Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trainer.specialization}</p>
                    <p className="text-sm text-gray-600">Specialization</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trainer.experience}</p>
                    <p className="text-sm text-gray-600">Experience</p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{aboutTitle}</h2>
                <div className="prose prose-gray max-w-none">
                  {aboutContent.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Services Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className={`relative ${service.featured ? "ring-2 ring-blue-500" : ""}`}>
                      <CardContent className="p-6">
                        {service.featured && <Badge className="absolute -top-2 left-4 bg-blue-500">Featured</Badge>}
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
                            <Euro className="h-5 w-5" />
                            {service.price}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Contact Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{contactTitle}</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{contactDescription}</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>{trainer.email}</span>
                  </div>
                  {contactPhone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span>{contactPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact {trainer.name}
                  </Button>
                  <Button variant="outline" size="lg">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
