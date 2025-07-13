"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Clock, Euro, Edit } from "lucide-react"
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
  aboutDescription?: string
  services?: Service[]
  contactEmail?: string
  contactPhone?: string
  contactLocation?: string
  seoTitle?: string
  seoDescription?: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<any>(null)
  const [content, setContent] = useState<TrainerContent>({})
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
        setContent(data.content || {})
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get display value with fallback
  const getDisplayValue = (contentValue: string | undefined, fallbackValue: string | undefined, defaultValue = "") => {
    return contentValue || fallbackValue || defaultValue
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600 mb-6">The trainer profile you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const displayServices =
    content.services && content.services.length > 0
      ? content.services
      : [
          {
            id: "1",
            title: "Personal Training",
            description: "One-on-one training sessions tailored to your goals",
            price: "€60",
            duration: "60 min",
          },
          {
            id: "2",
            title: "Group Training",
            description: "Small group sessions for motivation and community",
            price: "€30",
            duration: "45 min",
          },
        ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {getDisplayValue(
                content.heroTitle,
                `Transform Your Fitness with ${trainer.name}`,
                "Professional Fitness Training",
              )}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {getDisplayValue(
                content.heroSubtitle,
                `Professional ${trainer.specialization} training tailored to your goals`,
                "Achieve your fitness goals with expert guidance",
              )}
            </p>

            {/* Edit Button for Active Trainers */}
            {trainer.status === "active" && (
              <div className="mt-8">
                <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                  <Button variant="secondary" size="lg">
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Website Content
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {getDisplayValue(content.aboutTitle, "About Me", "About")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getDisplayValue(
                    content.aboutDescription,
                    `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping clients achieve their fitness goals through personalized training programs.`,
                    "Professional fitness trainer dedicated to helping you achieve your goals.",
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Services</h2>
                <div className="grid gap-6">
                  {displayServices.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        <div className="text-right">
                          <div className="flex items-center text-lg font-bold text-blue-600">
                            <Euro className="h-4 w-4 mr-1" />
                            {service.price}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trainer Info Card */}
            <Card className="shadow-lg sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {trainer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                  <p className="text-gray-600">{trainer.specialization}</p>
                  <Badge variant="secondary" className="mt-2">
                    {trainer.experience} Experience
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>

                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-blue-600" />
                    <span className="text-sm">
                      {getDisplayValue(content.contactEmail, trainer.email, "Email not provided")}
                    </span>
                  </div>

                  {(content.contactPhone || trainer.phone) && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="text-sm">{getDisplayValue(content.contactPhone, trainer.phone, "")}</span>
                    </div>
                  )}

                  {(content.contactLocation || trainer.location) && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="text-sm">{getDisplayValue(content.contactLocation, trainer.location, "")}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Trainer
                  </Button>

                  {trainer.status === "active" && (
                    <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Profile Status</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={trainer.status === "active" ? "default" : "secondary"}>
                    {trainer.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </div>
                {trainer.status === "temp" && (
                  <p className="text-xs text-gray-500 mt-2">Complete payment to activate your profile</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
