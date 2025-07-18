"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Phone, Mail, Star, Clock, CheckCircle, ArrowLeft, CreditCard } from "lucide-react"

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  status: string
  createdAt: string
  content?: {
    hero?: {
      title?: string
      subtitle?: string
      description?: string
    }
    about?: {
      title?: string
      content?: string
    }
    contact?: {
      email?: string
      phone?: string
      location?: string
      title?: string
      description?: string
    }
    services?: Array<{
      id: string
      title: string
      description: string
      price: number
      duration: string
      featured: boolean
    }>
  }
}

interface TempTrainerPageProps {
  trainer?: TrainerData
  tempId: string
  token?: string
}

export default function TempTrainerPage({ trainer: initialTrainer, tempId, token }: TempTrainerPageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerData | null>(initialTrainer || null)
  const [loading, setLoading] = useState(!initialTrainer)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialTrainer && tempId) {
      fetchTrainerData()
    }
  }, [tempId, initialTrainer])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      const url = token ? `/api/trainer/temp/${tempId}?token=${token}` : `/api/trainer/temp/${tempId}`

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load trainer data")
      }

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching trainer:", err)
      setError(err instanceof Error ? err.message : "Failed to load trainer data")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateWebsite = () => {
    if (trainer) {
      router.push(`/payment?tempId=${trainer.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer preview...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
                  Back to Marketplace
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Extract data with fallbacks for both nested content structure and root level
  const fullName = trainer.content?.contact?.fullName || trainer.fullName || "Trainer"
  const email = trainer.content?.contact?.email || trainer.email || ""
  const phone = trainer.content?.contact?.phone || trainer.phone || ""
  const location = trainer.content?.contact?.location || trainer.location || ""
  const specialty = trainer.content?.about?.specialty || trainer.specialty || ""
  const experience = trainer.experience || ""
  const bio = trainer.content?.about?.content || trainer.bio || ""
  const certifications = trainer.certifications || ""

  const heroTitle = trainer.content?.hero?.title || `Transform Your Fitness with ${fullName}`
  const heroSubtitle = trainer.content?.hero?.subtitle || `Professional trainer in ${location}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Preview Mode
              </Badge>
              <Badge variant="secondary">Pending Activation</Badge>
              <Button
                onClick={handleActivateWebsite}
                className="bg-[#D2FF28] text-black hover:bg-[#c5f01f] flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Activate Website - €70 ONE-TIME</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl mb-6 text-blue-100">{heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {experience && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="h-3 w-3 mr-1" />
                {experience} Experience
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </Badge>
            )}
            {specialty && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {specialty}
              </Badge>
            )}
          </div>
          <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#c5f01f]">
            Book Free Consultation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>About {fullName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {bio ||
                    `Passionate fitness professional dedicated to helping clients achieve their goals through ${specialty}.`}
                </p>

                {certifications && (
                  <div>
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-gray-600">{certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Services Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trainer.content?.services?.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.title}</h4>
                        <div className="text-right">
                          <p className="font-bold text-lg">€{service.price}</p>
                          <p className="text-sm text-gray-500">{service.duration}</p>
                        </div>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      {service.featured && (
                        <Badge className="mt-2" variant="secondary">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  )) || <div className="text-gray-500">Services will be customized based on your specialization</div>}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Client Testimonials</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#D2FF28] pl-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-2">
                      "Working with {fullName} has completely transformed my fitness journey. Their expertise in{" "}
                      {specialty} is unmatched!"
                    </p>
                    <p className="text-sm text-gray-500">- Sarah M.</p>
                  </div>

                  <div className="border-l-4 border-[#D2FF28] pl-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-2">
                      "Professional, knowledgeable, and motivating. I've achieved results I never thought possible!"
                    </p>
                    <p className="text-sm text-gray-500">- Mike R.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Stats */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
                <Separator />
                <Button className="w-full bg-black text-white hover:bg-gray-800">Schedule Consultation</Button>
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
                  <span className="font-semibold">{experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold">{specialty || "Fitness"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold">{trainer.services?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Activation CTA */}
            <Card className="bg-[#D2FF28] border-[#D2FF28]">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Ready to Go Live?</h3>
                  <p className="text-sm mb-4">
                    Your website preview looks great! Activate it now to start attracting clients.
                  </p>
                  <Button onClick={handleActivateWebsite} className="w-full bg-black text-white hover:bg-gray-800">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Activate for €70 ONE-TIME
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">One-time payment • No monthly fees • Full ownership</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
