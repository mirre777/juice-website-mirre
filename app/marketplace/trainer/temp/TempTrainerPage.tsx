"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Globe, Clock, DollarSign, Star, Award, Users } from "lucide-react"

interface TempTrainer {
  id: string
  name: string
  fullName: string
  email: string
  specialization: string
  bio: string
  experience: string
  certifications: string[]
  services: string[]
  pricing: any
  availability: any
  location: string
  phone: string
  website: string
  socialMedia: any
  images: string[]
  testimonials: any[]
  content: any
  isActive: boolean
  isPaid: boolean
  createdAt: string
  expiresAt: string
  token: string
}

interface TempTrainerPageProps {
  tempId: string
  token: string
}

export default function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TempTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()

  const loadTrainerData = async (attempt = 1) => {
    const startTime = Date.now()

    try {
      console.log(`🔄 Loading trainer data (attempt ${attempt})`, {
        tempId,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : "none",
      })

      setLoading(true)
      setError(null)

      const url = `/api/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`
      console.log("🌐 Fetching from URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const duration = Date.now() - startTime

      console.log("📡 API Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: `${duration}ms`,
        headers: Object.fromEntries(response.headers.entries()),
      })

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text()

      console.log("📄 Response text received", {
        length: responseText.length,
        preview: responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""),
      })

      // Try to parse as JSON
      let data: any
      try {
        data = JSON.parse(responseText)
        console.log("✅ JSON parsing successful", {
          hasSuccess: "success" in data,
          hasTrainer: "trainer" in data,
          hasError: "error" in data,
          dataKeys: Object.keys(data),
        })
      } catch (parseError) {
        console.error("❌ Failed to parse response", {
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
          responseText: responseText.substring(0, 200),
        })
        throw new Error(
          `Failed to parse API response: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`,
        )
      }

      if (!response.ok) {
        console.error("❌ API request failed", {
          status: response.status,
          statusText: response.statusText,
          error: data.error || "Unknown error",
          details: data.details,
        })

        if (response.status === 404) {
          setError("Trainer not found. The preview may have expired or the link is invalid.")
        } else if (response.status === 403) {
          setError("Access denied. Invalid or expired token.")
        } else if (response.status === 410) {
          setError("This trainer preview has expired. Previews are only available for 24 hours.")
        } else {
          setError(data.error || `Server error (${response.status})`)
        }
        return
      }

      if (!data.success || !data.trainer) {
        console.error("❌ Invalid response format", {
          hasSuccess: "success" in data,
          successValue: data.success,
          hasTrainer: "trainer" in data,
          dataStructure: Object.keys(data),
        })
        throw new Error("Invalid response format from server")
      }

      console.log("✅ Trainer data loaded successfully", {
        trainerId: data.trainer.id,
        trainerName: data.trainer.name,
        trainerEmail: data.trainer.email,
        duration: `${duration}ms`,
      })

      setTrainer(data.trainer)
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      const duration = Date.now() - startTime

      console.error("💥 Error loading trainer data", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        attempt,
        duration: `${duration}ms`,
        tempId,
      })

      if (attempt < 3) {
        console.log(`🔄 Retrying in 2 seconds (attempt ${attempt + 1}/3)`)
        setTimeout(() => {
          loadTrainerData(attempt + 1)
        }, 2000)
        return
      }

      setError(error instanceof Error ? error.message : "Failed to load trainer data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tempId && token) {
      console.log("🚀 Component mounted, loading trainer data", {
        tempId,
        hasToken: !!token,
      })
      loadTrainerData()
    } else {
      console.error("❌ Missing required parameters", {
        hasTempId: !!tempId,
        hasToken: !!token,
      })
      setError("Missing required parameters")
      setLoading(false)
    }
  }, [tempId, token])

  const handleRetry = () => {
    console.log("🔄 Manual retry triggered")
    setRetryCount(retryCount + 1)
    loadTrainerData(retryCount + 1)
  }

  const handleBackToMarketplace = () => {
    console.log("🏠 Navigating back to marketplace")
    router.push("/marketplace")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Trainer Profile</h2>
          <p className="text-gray-600">Please wait while we load the trainer information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <Button onClick={handleRetry} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={handleBackToMarketplace} className="w-full bg-transparent">
                    Back to Marketplace
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Trainer Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The trainer profile you're looking for doesn't exist or the preview has expired.
                </p>
                <Button onClick={handleBackToMarketplace} className="w-full">
                  Back to Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">Preview Mode</span>
              <span className="text-sm text-yellow-600">
                This is a temporary preview that expires on{" "}
                {new Date(trainer.expiresAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <Button size="sm" onClick={handleBackToMarketplace}>
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={trainer.images?.[0] || "/placeholder-user.jpg"} alt={trainer.name} />
                <AvatarFallback className="text-2xl">
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainer.fullName}</h1>
                <p className="text-xl text-blue-600 mb-3">{trainer.specialization}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {trainer.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trainer.location}</span>
                    </div>
                  )}
                  {trainer.experience && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{trainer.experience}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications Section */}
            {trainer.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials Section */}
            {trainer.testimonials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainer.testimonials.map((testimonial, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-gray-700 italic mb-2">"{testimonial.text}"</p>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{testimonial.author}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainer.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>
                )}
                {trainer.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{trainer.phone}</span>
                  </div>
                )}
                {trainer.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={trainer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            {trainer.pricing && Object.keys(trainer.pricing).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(trainer.pricing).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-gray-900">Ready to get started?</h3>
                  <p className="text-sm text-gray-600">
                    This is a preview. To activate your trainer profile and start accepting clients, complete your
                    payment.
                  </p>
                  <Button className="w-full" size="lg">
                    Activate Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
