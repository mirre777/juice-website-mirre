"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Dumbbell, Clock, Star, Mail, Phone, Calendar, Edit, ExternalLink } from "lucide-react"

interface TrainerData {
  id: string
  name: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications?: string[]
  isActive: boolean
  isPaid: boolean
  content?: {
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
        throw new Error(`Failed to fetch trainer data: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Trainer not found")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile could not be found"}</p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  const displayName = trainer.fullName || trainer.name
  const content = trainer.content

  // Use generated content if available, otherwise fallback to basic info
  const heroTitle = content?.hero?.title || `Transform Your Fitness with ${displayName}`
  const heroSubtitle =
    content?.hero?.subtitle || `Professional ${trainer.specialization} Training • ${trainer.experience} Experience`
  const heroDescription =
    content?.hero?.description ||
    `Welcome! I'm ${displayName}, a certified personal trainer specializing in ${trainer.specialization}. With ${trainer.experience} of experience in ${trainer.location}, I'm here to help you achieve your fitness goals.`

  const aboutTitle = content?.about?.title || "About Me"
  const aboutContent =
    content?.about?.content ||
    trainer.bio ||
    `I'm ${displayName}, a passionate fitness professional with ${trainer.experience} of experience in ${trainer.specialization}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.`

  const services = content?.services || [
    {
      id: "1",
      title: "Personal Training Session",
      description: `One-on-one personalized ${trainer.specialization.toLowerCase()} training session focused on your specific goals`,
      price: 60,
      duration: "60 minutes",
      featured: true,
    },
    {
      id: "2",
      title: "Fitness Assessment",
      description: "Comprehensive fitness evaluation and goal-setting session",
      price: 40,
      duration: "45 minutes",
      featured: false,
    },
    {
      id: "3",
      title: "Custom Workout Plan",
      description: `Personalized ${trainer.specialization.toLowerCase()} program designed for your goals and schedule`,
      price: 80,
      duration: "Digital delivery",
      featured: false,
    },
  ]

  const contactTitle = content?.contact?.title || "Let's Start Your Fitness Journey"
  const contactDescription =
    content?.contact?.description ||
    `Ready to transform your fitness with professional ${trainer.specialization.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`

  // Mock testimonials (same as preview)
  const testimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      rating: 5,
      text: `${displayName} completely transformed my approach to fitness. The personalized training sessions were exactly what I needed to reach my goals.`,
      date: "2 weeks ago",
    },
    {
      id: "2",
      name: "Mike Chen",
      rating: 5,
      text: `Professional, knowledgeable, and motivating. I've seen incredible results in just a few months of training.`,
      date: "1 month ago",
    },
    {
      id: "3",
      name: "Emma Wilson",
      rating: 5,
      text: `The best investment I've made in my health. ${displayName}'s expertise and support have been game-changing.`,
      date: "2 months ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] text-black py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              {trainer.isActive && trainer.isPaid && (
                <div className="mb-4">
                  <Button
                    onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                    className="bg-black text-[#D2FF28] hover:bg-gray-800"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </div>
              )}
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">{heroTitle}</h1>
              <p className="text-xl lg:text-2xl font-semibold mb-6">{heroSubtitle}</p>
              <p className="text-lg mb-8 max-w-2xl">{heroDescription}</p>
              <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800 text-lg px-8 py-3">
                Book Your Free Consultation
              </Button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-80 h-80 bg-black rounded-full flex items-center justify-center">
                <span className="text-[#D2FF28] text-8xl font-bold">{displayName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Badges */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{trainer.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-semibold">{trainer.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold">{trainer.experience}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6">{aboutTitle}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutContent}</p>
              </div>
            </section>

            {/* Services Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">Services</h2>
              <div className="grid gap-6">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`relative ${
                      service.featured ? "border-[#D2FF28] border-2 shadow-lg" : "border-gray-200"
                    }`}
                  >
                    {service.featured && (
                      <Badge className="absolute -top-2 left-4 bg-[#D2FF28] text-black hover:bg-[#D2FF28]">
                        Featured
                      </Badge>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#D2FF28]">€{service.price}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">What My Clients Say</h2>
              <div className="grid gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.date}</p>
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
            <Card className="bg-[#D2FF28] border-[#D2FF28] sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">{contactTitle}</h3>
                <p className="text-black mb-6 text-sm">{contactDescription}</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-black">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-3 text-black">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-black">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{trainer.location}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-black text-[#D2FF28] hover:bg-gray-800">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact {displayName.split(" ")[0]}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-black text-black hover:bg-black hover:text-[#D2FF28] bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specialties Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]">{trainer.specialization}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Card */}
            {trainer.certifications && trainer.certifications.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="space-y-2">
                    {trainer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#D2FF28] rounded-full"></div>
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{contactTitle}</h2>
          <p className="text-xl mb-8 text-gray-300">{contactDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 text-lg px-8 py-3">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#D2FF28] text-[#D2FF28] hover:bg-[#D2FF28] hover:text-black text-lg px-8 py-3 bg-transparent"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
