"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Star, Clock, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

interface Trainer {
  id: string
  name: string
  email: string
  phone?: string
  specialization: string
  experience: string
  location?: string
  bio?: string
  certifications?: string[]
  status: "temp" | "active" | "inactive"
  content?: TrainerContent
  createdAt: string
  activatedAt?: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainer()
  }, [trainerId])

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainer(data.trainer)
      } else if (response.status === 404) {
        setError("Trainer not found")
      } else {
        setError("Failed to load trainer profile")
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError("Error loading trainer profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juice"></div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "This trainer profile could not be found."}</p>
            <Link href="/marketplace">
              <Button>Browse Other Trainers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use edited content if available, otherwise fall back to original data
  const content = trainer.content || {}
  const heroTitle = content.heroTitle || `Transform Your Fitness with ${trainer.name}`
  const heroSubtitle = content.heroSubtitle || `Professional ${trainer.specialization} training tailored to your goals`
  const aboutTitle = content.aboutTitle || "About Me"
  const aboutDescription =
    content.aboutDescription ||
    trainer.bio ||
    `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} years of experience.`
  const services = content.services || [
    {
      id: "1",
      title: "Personal Training",
      description: "One-on-one training sessions tailored to your specific goals",
      price: "€60",
      duration: "60 min",
    },
  ]
  const contactEmail = content.contactEmail || trainer.email
  const contactPhone = content.contactPhone || trainer.phone
  const contactLocation = content.contactLocation || trainer.location

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-juice to-yellow-400 text-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-black/10 text-black">
                  {trainer.specialization}
                </Badge>
                {trainer.status === "active" && (
                  <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 border-white/30 text-black hover:bg-white/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Content
                    </Button>
                  </Link>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">{heroTitle}</h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">{heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Book a Session
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black/30 text-black hover:bg-black/10 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                  <Image
                    src="/placeholder-user.jpg"
                    alt={trainer.name}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">{aboutTitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{aboutDescription}</p>

                {trainer.certifications && trainer.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Services</h2>
                <div className="grid gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-juice">{service.price}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <Button className="w-full">Book This Service</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <Card className="overflow-hidden shadow-lg sticky top-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  {contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-juice" />
                      <a href={`mailto:${contactEmail}`} className="text-gray-600 hover:text-juice">
                        {contactEmail}
                      </a>
                    </div>
                  )}
                  {contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-juice" />
                      <a href={`tel:${contactPhone}`} className="text-gray-600 hover:text-juice">
                        {contactPhone}
                      </a>
                    </div>
                  )}
                  {contactLocation && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-juice" />
                      <span className="text-gray-600">{contactLocation}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Book a Session
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Experience</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-juice">{trainer.experience}</div>
                    <div className="text-sm text-gray-500">Years Experience</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-juice">4.9</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-juice">200+</div>
                    <div className="text-sm text-gray-500">Happy Clients</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
