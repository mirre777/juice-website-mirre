"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, CreditCard, Globe, Mail, MapPin, Phone, Star, User } from "lucide-react"
import { toast } from "sonner"
import { logger } from "@/lib/logger"

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
  expiresAt: string
  sessionToken: string
}

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActivating, setIsActivating] = useState(false)

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!tempId || !token) {
        setError("Invalid access link. Please check your URL.")
        setLoading(false)
        return
      }

      try {
        logger.info("Fetching temporary trainer data", { tempId })

        const response = await fetch(`/api/trainer/temp/${tempId}?token=${token}`)
        const result = await response.json()

        if (result.success) {
          setTrainerData(result.data)
          logger.info("Temporary trainer data loaded", {
            tempId,
            email: result.data.email,
          })
        } else {
          setError(result.error || "Failed to load trainer data")
          logger.error("Failed to load temporary trainer data", {
            tempId,
            error: result.error,
          })
        }
      } catch (error) {
        const errorMessage = "Failed to load trainer data. Please try again."
        setError(errorMessage)
        logger.error("Error fetching temporary trainer data", {
          tempId,
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [tempId, token])

  const handleActivateProfile = async () => {
    if (!trainerData) return

    setIsActivating(true)

    try {
      logger.info("Activating trainer profile", {
        tempId,
        email: trainerData.email,
      })

      // Here you would integrate with your payment processor
      // For now, we'll simulate the activation process
      toast.success("Redirecting to payment...")

      // Simulate payment redirect
      setTimeout(() => {
        window.location.href = `/payment?trainerId=${tempId}&token=${token}`
      }, 1500)
    } catch (error) {
      logger.error("Error activating trainer profile", {
        tempId,
        error: error instanceof Error ? error.message : String(error),
      })
      toast.error("Failed to activate profile. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your trainer profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => (window.location.href = "/marketplace/personal-trainer-website")}>
                Create New Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainerData) {
    return null
  }

  const expiresAt = new Date(trainerData.expiresAt)
  const timeRemaining = expiresAt.getTime() - Date.now()
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Trainer Website Preview</h1>
          <p className="text-gray-600">This is how your professional trainer website will look</p>
        </div>

        {/* Expiration Alert */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Temporary Profile:</strong> This preview expires in {hoursRemaining} hours. Activate your profile to
            make it permanent and start accepting clients.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {trainerData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainerData.fullName}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{trainerData.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{trainerData.specialty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{trainerData.experience}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trainerData.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{trainerData.bio}</p>
                {trainerData.certifications && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                    <p className="text-gray-600">{trainerData.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {trainerData.services.map((service) => (
                    <div key={service} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{trainerData.email}</span>
                </div>
                {trainerData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{trainerData.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{trainerData.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Activation Card */}
            <Card className="shadow-xl border-2 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-600">Activate Your Profile</CardTitle>
                <CardDescription>Make your website live and start accepting clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">$29</div>
                  <div className="text-gray-600 text-sm">per month</div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Professional website</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Custom domain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Client booking system</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Analytics dashboard</span>
                  </div>
                </div>

                <Button onClick={handleActivateProfile} className="w-full" size="lg" disabled={isActivating}>
                  {isActivating ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Activate Website
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">7-day free trial • Cancel anytime • No setup fees</p>
              </CardContent>
            </Card>

            {/* Preview Notice */}
            <Card className="shadow-xl bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-yellow-600 mb-2">
                    <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Preview Mode</h4>
                  <p className="text-yellow-700 text-sm">
                    This is a preview of your website. Activate to make it live and accessible to clients.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
