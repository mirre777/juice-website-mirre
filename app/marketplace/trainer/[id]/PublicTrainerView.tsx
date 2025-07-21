"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Dumbbell, Award, Phone, Mail, X } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    bio: string
  }
  contact: {
    title: string
    description: string
    phone: string
    email: string
    location: string
  }
  services: Service[]
  seo: {
    title: string
    description: string
  }
}

interface TrainerData {
  id: string
  fullName: string
  email: string
  experience: string
  specialty: string
  certifications?: string
  services: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  content?: TrainerContent
}

interface PublicTrainerViewProps {
  trainer: TrainerData
  content: TrainerContent
  onExitPublicView: () => void
}

export default function PublicTrainerView({ trainer, content, onExitPublicView }: PublicTrainerViewProps) {
  // Safe access to content with fallbacks
  const heroContent = content?.hero || {
    title: `Transform Your Fitness with ${trainer.fullName}`,
    subtitle: `Professional ${trainer.specialty} trainer`,
    description: "Professional fitness training services",
  }

  const aboutContent = content?.about || {
    title: "About Me",
    bio: "Professional trainer dedicated to helping clients achieve their fitness goals.",
  }

  const contactContent = content?.contact || {
    title: "Let's Start Your Fitness Journey",
    description: "Get in touch to schedule your consultation",
    phone: "",
    email: trainer.email,
    location: "",
  }

  const servicesContent = Array.isArray(content?.services) ? content.services : []

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Floating Exit Button */}
      <Button
        onClick={onExitPublicView}
        className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
        size="sm"
      >
        <X className="h-4 w-4 mr-2" />
        Exit Live View
      </Button>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
            <p className="text-xl mb-6 opacity-90">{heroContent.subtitle}</p>
            <p className="text-lg mb-6 opacity-80 max-w-3xl mx-auto">{heroContent.description}</p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="text-blue-600">
                <Award className="h-4 w-4 mr-1" />
                {trainer.experience} Experience
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <MapPin className="h-4 w-4 mr-1" />
                {contactContent.location || "Location"}
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <Dumbbell className="h-4 w-4 mr-1" />
                {trainer.specialty}
              </Badge>
            </div>
            <Button size="lg" variant="secondary" className="text-blue-600">
              Book Free Consultation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {aboutContent.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{aboutContent.bio}</p>
                {trainer.certifications && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-gray-600">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicesContent.length > 0 ? (
                    servicesContent.map((service, index) => (
                      <div key={service.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{service.title || "Service"}</h3>
                            {service.featured && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">€{service.price || 0}</div>
                            <div className="text-sm text-gray-500">{service.duration || "Duration"}</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{service.description || "Service description"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Services information coming soon</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>{contactContent.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{contactContent.description}</p>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{contactContent.email}</span>
                </div>

                {contactContent.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{contactContent.phone}</span>
                  </div>
                )}

                {contactContent.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{contactContent.location}</span>
                  </div>
                )}

                <Separator />
                <Button className="w-full">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{trainer.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold">{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{contactContent.location || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold">{servicesContent.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
