"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Mail, Phone, Clock, Euro, Star, CheckCircle, Timer } from "lucide-react"

interface TempTrainerData {
  id: string
  name: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  createdAt: string
  expiresAt: string
  isActive: boolean
  sessionToken?: string
}

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(true)

  // Get token from props or search params
  const accessToken = token || searchParams.get("token")

  useEffect(() => {
    if (tempId && accessToken) {
      fetchTrainerData()
    } else {
      console.error("Missing tempId or token", { tempId, hasToken: !!accessToken })
      setGenerating(false)
      setLoading(false)
    }
  }, [tempId, accessToken])

  const fetchTrainerData = async () => {
    try {
      // Simulate AI generation process
      setGenerating(true)

      // Show generating message for 3 seconds
      setTimeout(() => {
        setGenerating(false)
        loadTrainerData()
      }, 3000)
    } catch (error) {
      console.error("Error:", error)
      setGenerating(false)
      setLoading(false)
    }
  }

  const loadTrainerData = async () => {
    try {
      if (!accessToken) {
        throw new Error("No access token provided")
      }

      const response = await fetch(`/api/trainer/temp/${tempId}?token=${encodeURIComponent(accessToken)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load trainer profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = () => {
    // Navigate to payment page with tempId and token
    const paymentUrl = `/payment?tempId=${tempId}&token=${encodeURIComponent(accessToken || "")}`
    router.push(paymentUrl)
  }

  // Show generating screen
  if (generating) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">⚡</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Website Preview</h1>
                  <p className="text-sm text-gray-600">24-hour trial period</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer className="h-4 w-4" />
                  <span>Time remaining: 23h 59m 49s</span>
                </div>
                <Button className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">Activate for €29</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Generating Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Website...</h2>
            <p className="text-gray-600 mb-6">Our AI is creating your professional trainer website</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-[#D2FF28] h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
            </div>

            <p className="text-sm text-gray-500">This will take just a few seconds...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-600">Loading your trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600 mb-4">
            The trainer profile you're looking for doesn't exist or the preview has expired.
          </p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  // Calculate time remaining (24 hours from creation)
  const expiresAt = new Date(trainer.expiresAt)
  const now = new Date()
  const timeRemaining = Math.max(0, expiresAt.getTime() - now.getTime())
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  const displayName = trainer.fullName || trainer.name || "Trainer"

  // Ensure certifications is always an array
  const certifications = Array.isArray(trainer.certifications)
    ? trainer.certifications
    : typeof trainer.certifications === "string"
      ? [trainer.certifications]
      : ["Certified Personal Trainer"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">⚡</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Website Preview</h1>
                <p className="text-sm text-gray-600">24-hour trial period</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>
                  Time remaining: {hoursRemaining}h {minutesRemaining}m
                </span>
              </div>
              <Button onClick={handleActivate} className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">
                Activate for €29
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Website Preview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-lg border-0 bg-white">
          {/* Hero Section */}
          <div className="relative bg-[#D2FF28] text-black p-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Body, Transform Your Life</h1>
              <p className="text-xl mb-6">
                {trainer.specialization} • {trainer.experience} • {trainer.location}
              </p>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Book Your Free Consultation
              </Button>
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
                  <p className="text-gray-700 leading-relaxed mb-4">{trainer.bio}</p>

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

                {/* Services Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">My Training Services</h2>
                  <div className="grid gap-4">
                    <Card className="p-6">
                      <h3 className="font-bold text-lg mb-2">Flexibility & Mobility</h3>
                      <p className="text-gray-600 mb-4">
                        Personalized flexibility & mobility sessions tailored to your goals
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-lg font-bold text-[#D2FF28]">
                          <Euro className="h-4 w-4" />
                          60/session
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          60 min
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Testimonials */}
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
                        "Working with {displayName} has been life-changing. Their expertise in {trainer.specialization}{" "}
                        helped me achieve results I never thought possible."
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

              {/* Right Column - Contact & Info */}
              <div>
                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{trainer.email}</span>
                    </div>
                    {trainer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm">{trainer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{trainer.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-[#D2FF28] text-black hover:bg-[#C5F01A]">
                    Schedule Consultation
                  </Button>
                </Card>

                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Specialties</h3>
                  <div className="space-y-2">
                    <Badge className="bg-[#D2FF28] text-black hover:bg-[#C5F01A]">{trainer.specialization}</Badge>
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
                  <Button onClick={handleActivate} className="w-full bg-black text-white hover:bg-gray-800">
                    Activate for €29
                  </Button>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
