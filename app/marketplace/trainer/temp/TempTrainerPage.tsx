"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Navbar from "@/components/navbar"
import type { TrainerData } from "@/lib/firebase-trainer"
import { logger } from "@/lib/logger"

interface TempTrainerPageProps {
  trainer: TrainerData
  tempId: string
  token?: string
}

export default function TempTrainerPage({ trainer, tempId, token }: TempTrainerPageProps) {
  const [isActivating, setIsActivating] = useState(false)
  const [error, setError] = useState("")

  const handleActivateTrainer = async () => {
    setIsActivating(true)
    setError("")

    try {
      logger.info("Starting trainer activation", {
        tempId,
        email: trainer.email,
        hasToken: !!token,
      })

      // Create payment intent for trainer activation
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 7000, // €70.00 in cents
          currency: "eur",
          metadata: {
            type: "trainer_activation",
            tempId: tempId,
            trainerEmail: trainer.email,
            trainerName: trainer.fullName,
            token: token || "",
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        logger.info("Payment intent created, redirecting to payment", {
          tempId,
          clientSecret: result.clientSecret ? "present" : "missing",
        })

        // Redirect to payment page with client secret
        window.location.href = `/payment?client_secret=${result.clientSecret}&tempId=${tempId}`
      } else {
        logger.error("Failed to create payment intent", {
          tempId,
          error: result.error,
        })
        setError(result.error || "Failed to initiate payment")
      }
    } catch (err) {
      logger.error("Error during trainer activation", {
        tempId,
        error: err,
      })
      setError("Network error. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  const formatServices = (services: string[] | undefined) => {
    if (!services || services.length === 0) return "Personal Training"
    return services.join(", ")
  }

  const getExperienceColor = (experience: string) => {
    if (experience.includes("10+")) return "bg-purple-100 text-purple-800"
    if (experience.includes("5-10")) return "bg-blue-100 text-blue-800"
    if (experience.includes("3-5")) return "bg-green-100 text-green-800"
    if (experience.includes("1-2")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#D2FF28] px-4 py-2 rounded-full mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Preview Mode - 24 Hours Remaining</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Professional Trainer Website</h1>
          <p className="text-xl text-gray-600">Review your website preview and activate it for just €70</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section Preview */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-[#D2FF28] rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-black" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{trainer.fullName}</h2>
                    <p className="text-xl text-gray-300 mb-4">{trainer.specialty}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{trainer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{trainer.experience} Experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trainer.services?.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  )) || (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Personal Training</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {trainer.certifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications & Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{trainer.certifications}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activation Card */}
            <Card className="border-2 border-[#D2FF28]">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Activate Your Website</CardTitle>
                <p className="text-gray-600">Make your website live and start attracting clients</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">€70</div>
                  <p className="text-gray-600">One-time activation fee</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Professional website design</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Mobile-responsive layout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SEO optimized</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Contact form integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Easy content updates</span>
                  </div>
                </div>

                <Button
                  onClick={handleActivateTrainer}
                  disabled={isActivating}
                  className="w-full h-12 bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Activate Website
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">Secure payment powered by Stripe</p>
              </CardContent>
            </Card>

            {/* Contact Info Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{trainer.email}</span>
                </div>
                {trainer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{trainer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{trainer.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Experience Badge */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge className={`px-4 py-2 text-sm font-medium ${getExperienceColor(trainer.experience)}`}>
                    {trainer.experience} Experience
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">Professional Experience Level</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-500 space-y-1">
              <div>Temp ID: {tempId}</div>
              <div>Token: {token ? `${token.substring(0, 8)}...` : "None"}</div>
              <div>Status: {trainer.status}</div>
              <div>Created: {trainer.createdAt}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
