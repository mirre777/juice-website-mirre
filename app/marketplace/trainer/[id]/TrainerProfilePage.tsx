"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Phone, Mail, Clock, Award, Zap, User } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
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
    availability: string
  }
}

interface TrainerData {
  id: string
  name: string
  fullName?: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio?: string
  certifications?: string[]
  content?: TrainerContent
  isActive: boolean
  activatedAt?: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const { isCoach } = useTheme()
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerContent = async () => {
      try {
        console.log("=== TRAINER PROFILE PAGE DEBUG ===")
        console.log("1. Starting fetch for trainer ID:", trainerId)
        console.log("2. Current URL:", window.location.href)
        console.log("3. Making API call to:", `/api/trainer/content/${trainerId}`)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        console.log("4. API Response status:", response.status)
        console.log("5. API Response ok:", response.ok)

        if (!response.ok) {
          const errorData = await response.json()
          console.log("6. Error response data:", errorData)
          throw new Error(errorData.error || "Failed to fetch trainer content")
        }

        const data = await response.json()
        console.log("7. Success response data:", data)

        if (data.success && data.trainer) {
          console.log("8. Setting trainer data:", {
            id: data.trainer.id,
            name: data.trainer.name,
            isActive: data.trainer.isActive,
            hasContent: !!data.trainer.content,
          })
          setTrainerData(data.trainer)
        } else {
          console.log("9. Invalid trainer data structure:", data)
          throw new Error("Invalid trainer data received")
        }
      } catch (error) {
        console.error("10. Error in fetchTrainerContent:", error)
        console.error("11. Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        })
        setError(error instanceof Error ? error.message : "Failed to load trainer content")
      } finally {
        console.log("12. Setting loading to false")
        setLoading(false)
      }
    }

    if (trainerId) {
      console.log("=== TRAINER PROFILE PAGE INIT ===")
      console.log("Trainer ID provided:", trainerId)
      fetchTrainerContent()
    } else {
      console.error("No trainer ID provided!")
      setError("No trainer ID provided")
      setLoading(false)
    }
  }, [trainerId])

  if (loading) {
    console.log("Rendering loading state for trainer:", trainerId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice mx-auto mb-4"></div>
          <p className={`text-lg ${isCoach ? "text-black" : "text-white"}`}>Loading trainer profile...</p>
          <p className={`text-sm mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>ID: {trainerId}</p>
        </div>
      </div>
    )
  }

  if (error || !trainerData) {
    console.log("Rendering error state:", { error, hasTrainerData: !!trainerData })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Profile Not Available</h2>
            <p className="text-gray-600 mb-4">{error || "Trainer profile not found or not activated"}</p>
            <p className="text-sm text-gray-500 mb-4">Trainer ID: {trainerId}</p>
            <Button onClick={() => window.location.reload()} className="bg-juice text-black hover:bg-juice/90">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const content = trainerData.content

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Profile Not Ready</h2>
            <p className="text-gray-600 mb-4">This trainer profile is still being set up. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isCoach ? "bg-white" : "bg-black"}`}>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {content.hero.title}
          </h1>
          <p className={`text-xl mb-6 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>{content.hero.subtitle}</p>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${isCoach ? "text-gray-700" : "text-gray-300"}`}>
            {content.hero.description}
          </p>
          <Button size="lg" className="bg-juice text-black hover:bg-juice/90 px-8 py-3 text-lg">
            Book a Session
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                  <User className="w-5 h-5" />
                  {content.about.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg leading-relaxed ${isCoach ? "text-gray-700" : "text-gray-300"}`}>
                  {content.about.content}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                  <Zap className="w-5 h-5" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {content.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
                          {service.title}
                        </h4>
                        <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>{service.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4 bg-juice text-black">
                        {service.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                  <Star className="w-5 h-5" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {content.testimonials.map((testimonial, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>
                          {testimonial.name}
                        </span>
                      </div>
                      <p className={`${isCoach ? "text-gray-700" : "text-gray-300"} italic`}>"{testimonial.text}"</p>
                      {index < content.testimonials.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                  <Phone className="w-5 h-5" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-juice" />
                  <span className={`${isCoach ? "text-gray-700" : "text-gray-300"}`}>{content.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-juice" />
                  <span className={`${isCoach ? "text-gray-700" : "text-gray-300"}`}>{content.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-juice" />
                  <span className={`${isCoach ? "text-gray-700" : "text-gray-300"}`}>{content.contact.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-juice" />
                  <span className={`${isCoach ? "text-gray-700" : "text-gray-300"}`}>
                    {content.contact.availability}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                  <Award className="w-5 h-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-juice">{trainerData.experience}</div>
                  <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-juice">{trainerData.specialization}</div>
                  <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Specialization</div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
              <CardContent className="p-6 text-center">
                <h3 className={`font-bold mb-2 ${isCoach ? "text-black" : "text-white"}`}>Ready to Start?</h3>
                <p className={`text-sm mb-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  Book your first session today
                </p>
                <Button className="w-full bg-juice text-black hover:bg-juice/90">Contact Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
