"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  User,
  Award,
  Briefcase,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react"
import Navbar from "@/components/navbar"
import { logger } from "@/lib/logger"
import type { TrainerData } from "@/lib/firebase-trainer"

interface TempTrainerPageProps {
  trainer: TrainerData
}

export default function TempTrainerPage({ trainer }: TempTrainerPageProps) {
  const [isActivating, setIsActivating] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    logger.info("Starting trainer activation", {
      trainerId: trainer.id,
      email: trainer.email,
    })

    try {
      // Redirect to payment page with correct tempId parameter
      window.location.href = `/payment?tempId=${trainer.id}`
    } catch (error) {
      logger.error("Error activating trainer", {
        trainerId: trainer.id,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsActivating(false)
    }
  }

  const formatServices = (services?: string[]) => {
    if (!services || services.length === 0) return "No services specified"
    return services.join(", ")
  }

  const formatCertifications = (certifications?: string) => {
    if (!certifications) return "No certifications specified"
    return certifications
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#D2FF28] rounded-full">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg font-medium">Preview Ready</Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Trainer Website Preview</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here's how your professional trainer website will look. Review the details and activate when you're ready!
          </p>
        </div>

        {/* Preview Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{trainer.fullName}</CardTitle>
                <p className="text-gray-200">{trainer.specialty}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Hero Section Preview */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Fitness with {trainer.fullName}</h2>
              <p className="text-lg text-gray-600 mb-6">{trainer.bio}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-5 h-5" />
                  <span>{trainer.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5" />
                  <span>{trainer.specialty}</span>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{trainer.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Qualifications
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Experience Level</span>
                    <p className="text-gray-700">{trainer.experience}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Certifications</span>
                    <p className="text-gray-700">{formatCertifications(trainer.certifications)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Services Offered
              </h3>
              <p className="text-gray-700">{formatServices(trainer.services)}</p>
            </div>

            <Separator className="my-8" />

            {/* Activation Section */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <span className="text-lg font-medium text-gray-900">24 Hour Preview Period</span>
              </div>

              <p className="text-gray-600 mb-6">
                This preview will expire in 24 hours. Activate your website now for just €70 to make it live and start
                attracting clients!
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-[#D2FF28] hover:bg-[#B8E625] text-black disabled:opacity-50"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Activate Website - €70
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500">Secure payment • 30-day money-back guarantee • Cancel anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
            <p className="text-sm text-gray-600">Modern, mobile-responsive design that looks great on all devices</p>
          </Card>

          <Card className="text-center p-6">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy to Update</h3>
            <p className="text-sm text-gray-600">
              Update your content, services, and pricing anytime through our dashboard
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Client Booking</h3>
            <p className="text-sm text-gray-600">
              Integrated booking system to help clients schedule sessions with you
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
