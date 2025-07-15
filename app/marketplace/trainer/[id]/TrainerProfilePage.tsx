"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Mail, Phone, Clock, Euro, Star, CheckCircle, Edit } from "lucide-react"

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
  name: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialization: string
  specialty: string
  experience: string
  bio: string
  certifications: string[]
  isActive: boolean
  isPaid: boolean
  content?: TrainerContent
  createdAt: string
  activatedAt?: string
}

interface TrainerProfilePageProps {
  trainerId: string
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (trainerId) {
      fetchTrainerData()
    }
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch trainer data")
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Invalid trainer data")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      toast({
        title: "Error",
        description: "Failed to load trainer profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditContent = () => {
    router.push(`/marketplace/trainer/${trainerId}/edit`)
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

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600 mb-4">The trainer profile you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  const displayName = trainer.fullName || trainer.name || "Trainer"
  const specialty = trainer.specialization || trainer.specialty || "Personal Training"

  // Use generated content if available, otherwise fallback to basic info
  const content = trainer.content || {
    hero: {
      title: `Transform Your Fitness with ${displayName}`,
      subtitle: `Professional ${specialty} Training • ${trainer.experience}`,
      description: `Welcome! I'm ${displayName}, a certified personal trainer specializing in ${specialty}. With ${trainer.experience} of experience in ${trainer.location}, I'm here to help you achieve your fitness goals through personalized training programs that deliver real results.`,
    },
    about: {
      title: "About Me",
      content:
        trainer.bio ||
        `I'm ${displayName}, a passionate fitness professional with ${trainer.experience} of experience in ${specialty}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.`,
    },
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: `One-on-one personalized ${specialty.toLowerCase()} training session focused on your specific goals`,
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
        description: `Personalized ${specialty.toLowerCase()} program designed for your goals and schedule`,
        price: 80,
        duration: "Digital delivery",
        featured: false,
      },
    ],
    contact: {
      title: "Let's Start Your Fitness Journey",
      description: `Ready to transform your fitness with professional ${specialty.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`,
      email: trainer.email,
      phone: trainer.phone || "",
      location: trainer.location,
    },
  }

  // Ensure certifications is always an array
  const certifications = Array.isArray(trainer.certifications)
    ? trainer.certifications
    : typeof trainer.certifications === "string"
      ? [trainer.certifications]
      : ["Certified Personal Trainer"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Generated Website - Exact same UI as preview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-lg border-0 bg-white">
          {/* Hero Section - Exact same as preview */}
          <div className="relative bg-[#D2FF28] text-black p-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.hero.title}</h1>
              <p className="text-xl mb-6">{content.hero.subtitle}</p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Book Your Free Consultation
                </Button>
                {trainer.isActive && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleEditContent}
                    className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - About */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full"></div>
                    <h2 className="text-2xl font-bold">About {displayName}</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{content.about.content}</p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-black" />
                      </div>
                      <span className="text-sm">{trainer.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">Certified Professional</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Services Section - Exact same as preview */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">My Training Services</h2>
                  <div className="grid gap-4">
                    {content.services.map((service) => (
                      <Card key={service.id} className={`p-6 ${service.featured ? "border-2 border-[#D2FF28]" : ""}`}>
                        {service.featured && (
                          <Badge className="bg-[#D2FF28] text-black hover:bg-[#C5F01A] mb-2">Featured</Badge>
                        )}
                        <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-lg font-bold text-[#D2FF28]">
                            <Euro className="h-4 w-4" />
                            {service.price}/session
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Testimonials - Exact same as preview */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">What My Clients Say</h2>
                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Working with {displayName} has been life-changing. Their expertise in {specialty} helped me
                        achieve results I never thought possible."
                      </p>
                      <p className="text-sm text-gray-500">- Sarah M.</p>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Professional, knowledgeable, and motivating. {displayName} creates personalized programs that
                        actually work."
                      </p>
                      <p className="text-sm text-gray-500">- Mike R.</p>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact & Info - Exact same as preview */}
              <div>
                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{content.contact.email}</span>
                    </div>
                    {content.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm">{content.contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{content.contact.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-[#D2FF28] text-black hover:bg-[#C5F01A]">
                    Schedule Consultation
                  </Button>
                </Card>

                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Specialties</h3>
                  <div className="space-y-2">
                    <Badge className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">{specialty}</Badge>
                  </div>

                  <h4 className="font-semibold mt-4 mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {certifications.map((cert, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {cert}
                      </p>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-[#D2FF28]">
                  <h3 className="text-xl font-bold mb-2 text-black">Ready to Start?</h3>
                  <p className="text-sm text-black mb-4">
                    Book your free consultation today and take the first step towards your fitness goals.
                  </p>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Get Started Now</Button>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
