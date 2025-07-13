"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, CreditCard, Eye, Edit3, Loader2 } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"

interface TempTrainer {
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
  createdAt: string
  expiresAt: string
  status: "pending" | "expired"
}

export default function TempTrainerPage() {
  const searchParams = useSearchParams()
  const tempId = searchParams.get("id")

  const [trainer, setTrainer] = useState<TempTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activating, setActivating] = useState(false)

  useEffect(() => {
    if (!tempId) {
      setError("No trainer ID provided")
      setLoading(false)
      return
    }

    fetchTrainer()
  }, [tempId])

  const fetchTrainer = async () => {
    try {
      logger.info("Fetching temp trainer", { tempId })

      const response = await fetch(`/api/trainer/temp/${tempId}`)
      const result = await response.json()

      if (result.success) {
        setTrainer(result.trainer)
        logger.info("Temp trainer loaded successfully", {
          tempId,
          trainerName: result.trainer.fullName,
          status: result.trainer.status,
        })
      } else {
        setError(result.error || "Failed to load trainer profile")
        logger.error("Failed to load temp trainer", {
          tempId,
          error: result.error,
        })
      }
    } catch (err) {
      logger.error("Network error loading temp trainer", {
        tempId,
        error: err,
      })
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!trainer) return

    setActivating(true)
    logger.info("Starting trainer activation", {
      tempId: trainer.id,
      email: trainer.email,
    })

    try {
      const response = await fetch("/api/trainer/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempId: trainer.id }),
      })

      const result = await response.json()

      if (result.success) {
        logger.info("Trainer activation successful", {
          tempId: trainer.id,
          trainerId: result.trainerId,
          redirectUrl: result.redirectUrl,
        })

        // Redirect to payment or trainer profile
        window.location.href = result.redirectUrl
      } else {
        logger.error("Trainer activation failed", {
          tempId: trainer.id,
          error: result.error,
        })
        setError(result.error || "Failed to activate trainer profile")
      }
    } catch (err) {
      logger.error("Network error during activation", {
        tempId: trainer.id,
        error: err,
      })
      setError("Network error. Please try again.")
    } finally {
      setActivating(false)
    }
  }

  const getTimeRemaining = () => {
    if (!trainer) return ""

    const now = new Date()
    const expires = new Date(trainer.expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m remaining`
  }

  const isExpired = () => {
    if (!trainer) return false
    return new Date() > new Date(trainer.expiresAt)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/marketplace/personal-trainer-website">
              <Button>Create New Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Trainer Website Preview</h1>
              <p className="text-gray-600 mt-1">Review your profile and activate when ready</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isExpired() ? "destructive" : "secondary"} className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {getTimeRemaining()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Profile Preview
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">Preview Mode</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{trainer.fullName}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{trainer.specialty}</Badge>
                    <Badge variant="outline">{trainer.experience}</Badge>
                    <Badge variant="outline">{trainer.location}</Badge>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">{trainer.bio}</p>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {trainer.services.map((service) => (
                      <div key={service} className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {trainer.certifications && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                    <p className="text-gray-600">{trainer.certifications}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {trainer.email}
                    </p>
                    {trainer.phone && (
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {trainer.phone}
                      </p>
                    )}
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {trainer.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activation Card */}
            <Card className={isExpired() ? "border-red-200" : "border-green-200"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isExpired() ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {isExpired() ? "Profile Expired" : "Ready to Activate"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isExpired() ? (
                  <div>
                    <p className="text-red-600 mb-4">This profile has expired. You'll need to create a new one.</p>
                    <Link href="/marketplace/personal-trainer-website">
                      <Button className="w-full">Create New Profile</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Your profile looks great! Activate it now to make it live and start attracting clients.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Activation Fee</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">€29</p>
                      <p className="text-sm text-blue-700">One-time setup fee</p>
                    </div>

                    <Button
                      onClick={handleActivate}
                      disabled={activating}
                      className="w-full bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold"
                    >
                      {activating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Activate Profile - €29
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Profile Card */}
            {!isExpired() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Need Changes?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Want to modify your profile before activating? You can make changes anytime.
                  </p>
                  <Link href="/marketplace/personal-trainer-website">
                    <Button variant="outline" className="w-full bg-transparent">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Activate Profile</p>
                    <p className="text-sm text-gray-600">Pay the one-time setup fee</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Customize Website</p>
                    <p className="text-sm text-gray-600">Add photos, adjust content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Go Live</p>
                    <p className="text-sm text-gray-600">Share your website with clients</p>
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
