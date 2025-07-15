"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Star, Clock, Euro, Mail, Phone, Edit, ExternalLink, Award, Target, Calendar } from "lucide-react"

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
  certifications?: string[]
  status: string
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
      console.log("Fetching trainer data for ID:", trainerId)

      const response = await fetch(`/api/trainer/dashboard/${trainerId}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`Failed to fetch trainer data: ${response.status}`)
      }

      const data = await response.json()
      console.log("Trainer data received:", data)

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Trainer not found")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load trainer information"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
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
          <Button onClick={() => router.push("/marketplace")} className="w-full">
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  // Use generated content if available, otherwise fallback to basic info
  const displayName = trainer.fullName || trainer.name
  const heroTitle = trainer.content?.hero?.title || `Transform Your Fitness with ${displayName}`
  const heroSubtitle =
    trainer.content?.hero?.subtitle || `Professional ${trainer.specialty} Training • ${trainer.experience} Experience`
  const heroDescription =
    trainer.content?.hero?.description ||
    `Welcome! I'm ${displayName}, a certified personal trainer specializing in ${trainer.specialty}. With ${trainer.experience} of experience in ${trainer.location}, I'm here to help you achieve your fitness goals.`

  const aboutTitle = trainer.content?.about?.title || "About Me"
  const aboutContent =
    trainer.content?.about?.content ||
    trainer.bio ||
    `I'm ${displayName}, a passionate fitness professional with ${trainer.experience} of experience in ${trainer.specialty}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.`

  const services = trainer.content?.services || [
    {
      id: "1",
      title: "Personal Training Session",
      description: `One-on-one personalized ${trainer.specialty.toLowerCase()} training session focused on your specific goals`,
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
      description: `Personalized ${trainer.specialty.toLowerCase()} program designed for your goals and schedule`,
      price: 80,
      duration: "Digital delivery",
      featured: false,
    },
  ]

  const contactTitle = trainer.content?.contact?.title || "Let's Start Your Fitness Journey"
  const contactDescription =
    trainer.content?.contact?.description ||
    `Ready to transform your fitness with professional ${trainer.specialty.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`

  // Mock testimonials for now
  const testimonials = [
    {
      id: "1",
      name: "Sarah M.",
      rating: 5,
      text: `${displayName} completely transformed my approach to fitness. The personalized training sessions were exactly what I needed!`,
      date: "2 weeks ago",
    },
    {
      id: "2",
      name: "Mike R.",
      rating: 5,
      text: "Professional, knowledgeable, and motivating. I've seen incredible results in just a few months.",
      date: "1 month ago",
    },
    {
      id: "3",
      name: "Emma L.",
      rating: 5,
      text: "The custom workout plan fits perfectly into my busy schedule. Highly recommend!",
      date: "3 weeks ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#D2FF28] text-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
              <p className="text-xl mb-6">{heroSubtitle}</p>
              <p className="text-lg mb-8 max-w-2xl">{heroDescription}</p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2 bg-black/10 rounded-full px-4 py-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{trainer.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 rounded-full px-4 py-2">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">{trainer.specialty}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 rounded-full px-4 py-2">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">{trainer.experience}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-black text-[#D2FF28] hover:bg-gray-800">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Your Free Consultation
                </Button>
                {trainer.isActive && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-[#D2FF28] bg-transparent"
                    onClick={() => router.push(`/marketplace/trainer/${trainerId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-80 h-80 bg-black/10 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center">
                  <span className="text-[#D2FF28] text-4xl font-bold">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{aboutTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {aboutContent.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-6 rounded-lg border-2 ${
                        service.featured ? "border-[#D2FF28] bg-[#D2FF28]/5" : "border-gray-200 bg-white"
                      }`}
                    >
                      {service.featured && (
                        <Badge className="mb-3 bg-[#D2FF28] text-black hover:bg-[#D2FF28]/80">Featured</Badge>
                      )}
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4 text-[#D2FF28]" />
                          <span className="font-bold text-xl">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border-l-4 border-[#D2FF28] pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#D2FF28] text-[#D2FF28]" />
                          ))}
                        </div>
                        <span className="font-medium">{testimonial.name}</span>
                        <span className="text-sm text-gray-500">• {testimonial.date}</span>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-[#D2FF28] border-[#D2FF28]">
              <CardHeader>
                <CardTitle className="text-black">{contactTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black mb-6">{contactDescription}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-black" />
                    <a href={`mailto:${trainer.email}`} className="text-black hover:underline font-medium">
                      {trainer.email}
                    </a>
                  </div>

                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-black" />
                      <a href={`tel:${trainer.phone}`} className="text-black hover:underline font-medium">
                        {trainer.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-black" />
                    <span className="text-black font-medium">{trainer.location}</span>
                  </div>
                </div>

                <Separator className="my-6 bg-black/20" />

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

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/80">{trainer.specialty}</Badge>
                  {trainer.certifications?.map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{trainer.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{trainer.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clients Trained</span>
                    <span className="font-medium">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#D2FF28] text-[#D2FF28]" />
                      <span className="font-medium">5.0</span>
                    </div>
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
