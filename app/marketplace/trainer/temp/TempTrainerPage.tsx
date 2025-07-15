"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Award, Star, Phone, Mail, Calendar, CheckCircle, AlertCircle, Zap } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface TempTrainerPageProps {
  tempId: string
  token?: string
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
  status: string
  createdAt: string
  expiresAt: string
  hasSessionToken: boolean
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
    services?: Array<{
      name: string
      description: string
      price?: string
    }>
    testimonials?: Array<{
      name: string
      text: string
      rating: number
    }>
    contact?: {
      title?: string
      description?: string
    }
  }
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const { isCoach } = useTheme()
  const router = useRouter()
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        console.log("Fetching trainer data for:", tempId, "with token:", token?.substring(0, 10) + "...")
        const url = token
          ? `/api/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`
          : `/api/trainer/temp/${tempId}`

        const response = await fetch(url)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch trainer data")
        }

        const data = await response.json()
        console.log("Trainer data received:", data)

        if (data.success && data.trainer) {
          setTrainerData(data.trainer)
        } else {
          throw new Error("Invalid trainer data received")
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
        setError(error instanceof Error ? error.message : "Failed to load trainer data")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [tempId, token])

  // Calculate time remaining
  useEffect(() => {
    if (!trainerData?.expiresAt) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const expiresAt = new Date(trainerData.expiresAt)
      const diff = expiresAt.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Expired")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeRemaining(`${hours}h ${minutes}m`)
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [trainerData?.expiresAt])

  const handleActivate = () => {
    if (!token) {
      console.error("No token available for payment")
      return
    }

    const paymentUrl = `/payment?tempId=${tempId}&token=${encodeURIComponent(token)}`
    console.log("Navigating to payment:", paymentUrl)
    router.push(paymentUrl)
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

  if (error || !trainerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
            <p className="text-gray-600 mb-4">{error || "Trainer profile not found"}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayName = trainerData.fullName || trainerData.name
  const heroTitle = trainerData.content?.hero?.title || `Transform Your Fitness with ${displayName}`
  const heroSubtitle = trainerData.content?.hero?.subtitle || `Professional ${trainerData.specialization} Training`
  const heroDescription =
    trainerData.content?.hero?.description ||
    `Get personalized training programs and expert guidance from ${displayName}, a certified ${trainerData.specialization.toLowerCase()} trainer with ${trainerData.experience} of experience in ${trainerData.location}.`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Trial Info */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Website Preview</h1>
                <p className="text-sm text-gray-600">24-hour trial period</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Time remaining: {timeRemaining}</span>
              </div>
              <Button
                onClick={handleActivate}
                className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 font-semibold"
                disabled={!token}
              >
                <Zap className="w-4 h-4 mr-2" />
                Activate for €69
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#D2FF28] text-black mb-4">{trainerData.specialization}</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
              <p className="text-xl text-gray-300 mb-6">{heroSubtitle}</p>
              <p className="text-gray-400 mb-8 leading-relaxed">{heroDescription}</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
                  Start Training
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  View Programs
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#D2FF28] to-yellow-400 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">💪</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {trainerData.content?.about?.title || `About ${displayName}`}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {trainerData.content?.about?.content ||
                  `With ${trainerData.experience} of experience in ${trainerData.specialization.toLowerCase()}, I'm passionate about helping clients achieve their fitness goals through personalized training programs and expert guidance.`}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-sm text-gray-600">Certified Trainer</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-sm text-gray-600">{trainerData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-sm text-gray-600">{trainerData.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-sm text-gray-600">5.0 Rating</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-4xl">🏋️‍♂️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive fitness programs tailored to your goals and fitness level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(
              trainerData.content?.services || [
                {
                  name: "Personal Training",
                  description: "One-on-one training sessions customized to your specific goals and fitness level.",
                  price: "€80/session",
                },
                {
                  name: "Group Classes",
                  description: "Small group training sessions that combine motivation with personalized attention.",
                  price: "€25/session",
                },
                {
                  name: "Online Coaching",
                  description: "Remote training programs with video calls and personalized workout plans.",
                  price: "€150/month",
                },
              ]
            ).map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.price && <div className="text-lg font-semibold text-[#D2FF28]">{service.price}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <p className="text-gray-600">See what my clients have to say about their transformation journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(
              trainerData.content?.testimonials || [
                {
                  name: "Sarah M.",
                  text: "Amazing results in just 3 months! The personalized approach really made the difference.",
                  rating: 5,
                },
                {
                  name: "Mike R.",
                  text: "Professional, knowledgeable, and motivating. Highly recommend!",
                  rating: 5,
                },
                {
                  name: "Lisa K.",
                  text: "Finally found a trainer who understands my goals and helps me achieve them.",
                  rating: 5,
                },
              ]
            ).map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {trainerData.content?.contact?.title || "Ready to Start Your Fitness Journey?"}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {trainerData.content?.contact?.description ||
                "Get in touch today to schedule your consultation and take the first step towards your fitness goals."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-gray-300">{trainerData.email}</span>
                </div>
                {trainerData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D2FF28]" />
                    <span className="text-gray-300">{trainerData.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-gray-300">{trainerData.location}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Schedule Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">Book Free Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
