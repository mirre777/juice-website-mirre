"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Dumbbell, Clock, Star, Mail, Phone, Edit, ExternalLink, CheckCircle } from "lucide-react"

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
    id: string
    title: string
    description: string
    price: number
    duration: string
    featured: boolean
  }>
  contact: {
    title: string
    description: string
    email: string
    phone: string
    location: string
  }
  seo: {
    title: string
    description: string
  }
}

interface TrainerData {
  id: string
  fullName: string
  name: string
  email: string
  phone?: string
  location: string
  specialty: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  content?: TrainerContent
  createdAt: any
  activatedAt: any
  updatedAt: any
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/dashboard/${trainerId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch trainer: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Trainer not found")
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError(error instanceof Error ? error.message : "Failed to load trainer")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile could not be found"}</p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  // Use generated content if available, otherwise fallback to basic info
  const content = trainer.content
  const displayName = trainer.fullName || trainer.name
  const specialty = trainer.specialty || trainer.specialization

  // Generate testimonials (same as preview)
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      text: `${displayName} completely transformed my approach to fitness. The personalized ${specialty.toLowerCase()} program was exactly what I needed!`,
      location: trainer.location,
    },
    {
      id: 2,
      name: "Mike R.",
      rating: 5,
      text: `Professional, knowledgeable, and motivating. I've seen incredible results with ${displayName}'s training methods.`,
      location: trainer.location,
    },
    {
      id: 3,
      name: "Emma L.",
      rating: 5,
      text: `Best investment I've made in my health. ${displayName} creates programs that actually work and fit my busy schedule.`,
      location: trainer.location,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] text-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="flex-1 text-center lg:text-left">
              {trainer.isActive && (
                <div className="flex justify-center lg:justify-start mb-4">
                  <Button
                    onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-black/20 text-black hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {content?.hero.title || `Transform Your Fitness with ${displayName}`}
              </h1>

              <p className="text-xl mb-6 opacity-90">
                {content?.hero.subtitle || `Professional ${specialty} Training • ${trainer.experience} Experience`}
              </p>

              <p className="text-lg mb-8 opacity-80 max-w-2xl">
                {content?.hero.description ||
                  `Welcome! I'm ${displayName}, a certified personal trainer specializing in ${specialty}. With ${trainer.experience} of experience in ${trainer.location}, I'm here to help you achieve your fitness goals.`}
              </p>

              <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800 px-8 py-3 text-lg font-semibold">
                Book Your Free Consultation
              </Button>
            </div>

            {/* Right side - Trainer Avatar */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-black/10 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold text-black">{displayName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{trainer.location}</h3>
                <p className="text-gray-600 text-sm">Location</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Dumbbell className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{specialty}</h3>
                <p className="text-gray-600 text-sm">Specialization</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{trainer.experience}</h3>
                <p className="text-gray-600 text-sm">Experience</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content?.about.title || "About Me"}</h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                {content?.about.content ? (
                  content.about.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>
                    {trainer.bio ||
                      `I'm ${displayName}, a passionate fitness professional with ${trainer.experience} of experience in ${specialty}. I'm here to help you achieve your fitness goals through personalized training programs.`}
                  </p>
                )}
              </div>
            </section>

            {/* Services Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {content?.services ? (
                  content.services.map((service) => (
                    <Card key={service.id} className={`relative ${service.featured ? "ring-2 ring-blue-500" : ""}`}>
                      {service.featured && (
                        <Badge className="absolute -top-2 left-4 bg-blue-500 text-white">Featured</Badge>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">€{service.price}</span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  // Default services if no content generated
                  <>
                    <Card className="relative ring-2 ring-blue-500">
                      <Badge className="absolute -top-2 left-4 bg-blue-500 text-white">Featured</Badge>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">Personal Training Session</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                          One-on-one personalized {specialty.toLowerCase()} training session focused on your specific
                          goals
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">€60</span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            60 minutes
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">Fitness Assessment</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                          Comprehensive fitness evaluation and goal-setting session
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">€40</span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            45 minutes
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">Custom Workout Plan</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                          Personalized {specialty.toLowerCase()} program designed for your goals and schedule
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">€80</span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            Digital delivery
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </section>

            {/* Testimonials Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Client Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{testimonial.name}</span>
                        <span className="text-gray-500 text-sm">{testimonial.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-[#D2FF28] border-[#D2FF28]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  {content?.contact.title || "Let's Start Your Fitness Journey"}
                </h3>
                <p className="text-black mb-6 text-sm">
                  {content?.contact.description ||
                    `Ready to transform your fitness with professional ${specialty.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-black">
                    <Mail className="h-4 w-4 mr-3" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center text-black">
                      <Phone className="h-4 w-4 mr-3" />
                      <span className="text-sm">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-black">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span className="text-sm">{trainer.location}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-black text-[#D2FF28] hover:bg-gray-800">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact {displayName.split(" ")[0]}
                  </Button>
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black/10 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specialties Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Specialties</h3>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-[#D2FF28] text-black">
                    {specialty}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Card */}
            {trainer.certifications && trainer.certifications.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Certifications</h3>
                  <div className="space-y-2">
                    {trainer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
