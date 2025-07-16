"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"

interface TrainerProfilePageProps {
  trainerId: string
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
  services?: string[]
  isActive: boolean
  status: string
  content: {
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
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrainerContent() {
      console.log("=== TRAINER PROFILE PAGE INIT ===")
      console.log("Trainer ID provided:", trainerId)

      if (!trainerId) {
        console.error("No trainer ID provided")
        setError("No trainer ID provided")
        setLoading(false)
        return
      }

      console.log("1. Starting fetch for trainer ID:", trainerId)
      console.log("2. Current URL:", window.location.href)
      console.log("3. Making API call to: /api/trainer/content/" + trainerId)

      try {
        const response = await fetch(`/api/trainer/content/${trainerId}`)
        console.log("4. API Response status:", response.status)
        console.log("5. API Response ok:", response.ok)
        console.log("6. Response content-type:", response.headers.get("content-type"))

        if (!response.ok) {
          const errorText = await response.text()
          console.error("7. API Error response:", errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log("8. JSON response parsed successfully:", { success: data.success, content: !!data.content })

        if (data.success && data.trainer) {
          console.log("9. Valid trainer data structure:", {
            id: data.trainer.id,
            name: data.trainer.name,
            hasContent: !!data.trainer.content,
          })
          setTrainer(data.trainer)
        } else {
          console.error("10. Invalid trainer data structure:", data)
          throw new Error("Invalid trainer data received")
        }
      } catch (err) {
        console.error("11. Error in fetchTrainerContent:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer profile")
      } finally {
        console.log("12. Setting loading to false")
        setLoading(false)
      }
    }

    fetchTrainerContent()
  }, [trainerId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Profile Not Available</CardTitle>
            <CardDescription>{error}</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">Trainer ID: {trainerId}</p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()} className="bg-yellow-500 hover:bg-yellow-600">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Trainer Not Found</CardTitle>
            <CardDescription>The requested trainer profile could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Avatar className="w-24 h-24 mr-6">
                <AvatarImage src={`/placeholder_svg.png?height=96&width=96&text=${trainer.name.charAt(0)}`} />
                <AvatarFallback className="text-2xl">{trainer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{trainer.name}</h1>
                <p className="text-xl text-gray-600 mb-2">{trainer.content.hero.subtitle}</p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verified Trainer</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">{trainer.content.hero.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>{trainer.content.about.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.content.about.content}</p>
                {trainer.certifications && trainer.certifications.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trainer.content.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.title}</h4>
                        <span className="text-lg font-bold text-primary">{service.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trainer.content.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">{renderStars(testimonial.rating)}</div>
                        <span className="font-medium">{testimonial.name}</span>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-gray-500" />
                  <a href={`mailto:${trainer.content.contact.email}`} className="text-primary hover:underline">
                    {trainer.content.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-gray-500" />
                  <a href={`tel:${trainer.content.contact.phone}`} className="text-primary hover:underline">
                    {trainer.content.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{trainer.content.contact.location}</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <span className="text-sm">{trainer.content.contact.availability}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{trainer.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{trainer.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{trainer.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={trainer.isActive ? "default" : "secondary"}>
                    {trainer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full" size="lg">
                  Book a Session
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">Get started with your fitness journey today</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
