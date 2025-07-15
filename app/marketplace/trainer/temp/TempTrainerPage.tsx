"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Mail, Phone, Clock, Euro, Star, CheckCircle, Timer, AlertCircle } from "lucide-react"

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
  services: string[]
  pricing: Record<string, any>
  availability: Record<string, any>
  website: string
  socialMedia: Record<string, string>
  images: string[]
  testimonials: any[]
  content: any
  isActive: boolean
  isPaid: boolean
  createdAt: string
  expiresAt: string
  token: string
}

interface ApiResponse {
  success: boolean
  trainer?: TempTrainerData
  error?: string
  details?: string
  timestamp?: string
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
  const [error, setError] = useState<string | null>(null)

  // Get token from props or search params
  const accessToken = token || searchParams.get("token")

  useEffect(() => {
    console.log("🎯 TempTrainerPage useEffect triggered", {
      tempId,
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
    })

    if (tempId && accessToken) {
      fetchTrainerData()
    } else {
      console.error("❌ Missing required parameters", {
        tempId,
        hasToken: !!accessToken,
        searchParamsToken: searchParams.get("token"),
        propsToken: token,
      })
      setError("Missing trainer ID or access token")
      setGenerating(false)
      setLoading(false)
    }
  }, [tempId, accessToken])

  const fetchTrainerData = async () => {
    try {
      console.log("🚀 Starting trainer data fetch process")

      // Simulate AI generation process
      setGenerating(true)
      setError(null)

      // Show generating message for 3 seconds
      setTimeout(() => {
        console.log("⏰ Generation timeout completed, loading trainer data")
        setGenerating(false)
        loadTrainerData()
      }, 3000)
    } catch (error) {
      console.error("💥 Error in fetchTrainerData:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setGenerating(false)
      setLoading(false)
    }
  }

  const loadTrainerData = async () => {
    try {
      if (!accessToken) {
        throw new Error("No access token provided")
      }

      console.log("📡 Loading trainer data from API", {
        tempId,
        hasToken: !!accessToken,
        tokenPreview: accessToken.substring(0, 10) + "...",
      })

      const url = `/api/trainer/temp/${tempId}?token=${encodeURIComponent(accessToken)}`
      console.log("🌐 Fetching from URL:", url)

      const fetchStartTime = Date.now()

      // Add timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      let response: Response
      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": navigator.userAgent,
          },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.error("❌ Fetch request failed", {
          error: fetchError instanceof Error ? fetchError.message : String(fetchError),
          url,
          tempId,
        })
        throw new Error(`Network request failed: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`)
      }

      const fetchDuration = Date.now() - fetchStartTime

      console.log("📥 API Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: `${fetchDuration}ms`,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        url: response.url,
      })

      let responseText: string
      let data: ApiResponse

      try {
        responseText = await response.text()
        console.log("📄 Response text received", {
          length: responseText.length,
          preview: responseText.substring(0, 300) + (responseText.length > 300 ? "..." : ""),
          isJson: responseText.trim().startsWith("{") || responseText.trim().startsWith("["),
          contentType: response.headers.get("content-type"),
        })

        // Check if response is JSON based on content type and content
        const contentType = response.headers.get("content-type") || ""
        const isJsonContentType = contentType.includes("application/json")
        const looksLikeJson = responseText.trim().startsWith("{") || responseText.trim().startsWith("[")

        if (!isJsonContentType && !looksLikeJson) {
          console.error("❌ Response is not JSON", {
            responseText: responseText.substring(0, 500),
            responseStatus: response.status,
            contentType,
            isJsonContentType,
            looksLikeJson,
          })

          // Handle common error responses
          if (responseText.toLowerCase().includes("internal server error")) {
            throw new Error("Server encountered an internal error. Please try again later.")
          } else if (responseText.toLowerCase().includes("not found")) {
            throw new Error("Trainer profile not found or has expired.")
          } else {
            throw new Error(`Server returned unexpected response: ${responseText.substring(0, 100)}...`)
          }
        }

        data = JSON.parse(responseText)
        console.log("📊 Response parsed successfully", {
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          hasSuccess: !!data.success,
          hasTrainer: !!data.trainer,
          hasError: !!data.error,
          success: data.success,
        })
      } catch (parseError) {
        console.error("❌ Failed to parse response", {
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
          responseText: responseText?.substring(0, 500),
          responseStatus: response.status,
          contentType: response.headers.get("content-type"),
        })
        throw new Error(
          `Failed to parse server response: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}. Response: ${responseText?.substring(0, 100)}...`,
        )
      }

      if (!response.ok) {
        console.error("❌ API Error Response", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details,
          timestamp: data.timestamp,
          responseData: data,
        })

        const errorMessage = data.error || data.details || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      if (data.success && data.trainer) {
        console.log("✅ Trainer data received successfully", {
          trainerName: data.trainer.name,
          trainerEmail: data.trainer.email,
          trainerKeys: Object.keys(data.trainer),
          certificationsCount: data.trainer.certifications?.length || 0,
          servicesCount: data.trainer.services?.length || 0,
        })
        setTrainer(data.trainer)
      } else {
        console.error("❌ Invalid response format", {
          hasSuccess: !!data.success,
          hasTrainer: !!data.trainer,
          dataKeys: Object.keys(data),
          data,
        })
        throw new Error(data.error || "Invalid response format from server")
      }
    } catch (error) {
      console.error("💥 Error loading trainer data:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        tempId,
        hasToken: !!accessToken,
      })

      const errorMessage = error instanceof Error ? error.message : "Failed to load trainer profile"
      setError(errorMessage)

      toast({
        title: "Error Loading Profile",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = () => {
    console.log("🎯 Activate button clicked", { tempId, hasToken: !!accessToken })

    if (!accessToken) {
      console.error("❌ No access token for activation")
      toast({
        title: "Error",
        description: "Missing access token for activation",
        variant: "destructive",
      })
      return
    }

    // Navigate to payment page with tempId and token
    const paymentUrl = `/payment?tempId=${tempId}&token=${encodeURIComponent(accessToken)}`
    console.log("🔄 Navigating to payment:", paymentUrl)
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
                  <span>Time remaining: 23h 59m</span>
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

  // Show error screen
  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profile</h1>
          <p className="text-gray-600 mb-6 text-sm">
            {error || "The trainer profile you're looking for doesn't exist or the preview has expired."}
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
              Back to Marketplace
            </Button>
          </div>
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

  // Ensure services is always an array
  const services = Array.isArray(trainer.services) ? trainer.services : ["Personal Training", "Fitness Consultation"]

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
                    {services.map((service, index) => (
                      <Card key={index} className="p-6">
                        <h3 className="font-bold text-lg mb-2">{service}</h3>
                        <p className="text-gray-600 mb-4">
                          Personalized {service.toLowerCase()} sessions tailored to your goals
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-lg font-bold text-[#D2FF28]">
                            <Euro className="h-4 w-4" />
                            {trainer.pricing?.session || 60}/session
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            60 min
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Testimonials */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">What My Clients Say</h2>
                  <div className="space-y-6">
                    {trainer.testimonials.map((testimonial, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
                        <p className="text-sm text-gray-500">- {testimonial.author}</p>
                      </Card>
                    ))}
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
