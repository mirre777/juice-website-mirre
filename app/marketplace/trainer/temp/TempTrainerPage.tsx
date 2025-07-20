"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Star, Clock, Award, Users } from "lucide-react"
import type { TrainerData } from "@/lib/firebase-trainer"

interface TempTrainerPageProps {
  trainer: TrainerData
  tempId: string
  token?: string
}

export default function TempTrainerPage({ trainer, tempId, token }: TempTrainerPageProps) {
  const [isActivating, setIsActivating] = useState(false)

  const handleActivateTrainer = async () => {
    setIsActivating(true)
    try {
      // Redirect to payment page with trainer data
      const paymentUrl = `/payment?tempId=${tempId}${token ? `&token=${token}` : ""}`
      window.location.href = paymentUrl
    } catch (error) {
      console.error("Error redirecting to payment:", error)
      setIsActivating(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainer Website Preview</h1>
          <p className="text-gray-600">This is how your trainer profile will look once activated</p>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={trainer.profileImage || "/placeholder.svg"} alt={trainer.fullName} />
                <AvatarFallback className="text-2xl bg-blue-500 text-white">
                  {getInitials(trainer.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{trainer.fullName}</CardTitle>
            <p className="text-lg text-blue-600 font-medium">{trainer.specialty}</p>
            <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{trainer.location}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{trainer.email}</span>
              </div>
              {trainer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">{trainer.phone}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Experience */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900">Experience:</span>
              <Badge variant="secondary">{trainer.experience}</Badge>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                About Me
              </h3>
              <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
            </div>

            {/* Certifications */}
            {trainer.certifications && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Certifications
                </h3>
                <p className="text-gray-700">{trainer.certifications}</p>
              </div>
            )}

            {/* Services */}
            {trainer.services && trainer.services.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  Services Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Hourly Rate */}
            {trainer.hourlyRate && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Hourly Rate:</span>
                  <span className="text-2xl font-bold text-green-600">${trainer.hourlyRate}/hour</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activation Section */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Activate Your Trainer Website?</h2>
            <p className="text-gray-600 mb-6">
              Your profile looks great! Complete the payment to make your trainer website live and start accepting
              clients.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Live trainer website with your custom URL</li>
                  <li>✓ Professional profile visible to potential clients</li>
                  <li>✓ Ability to edit and update your content anytime</li>
                  <li>✓ Client booking and contact features</li>
                </ul>
              </div>

              <Button
                onClick={handleActivateTrainer}
                disabled={isActivating}
                size="lg"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {isActivating ? "Redirecting to Payment..." : "Activate My Website - $29/month"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mt-8 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Temp ID: {tempId}</p>
                <p>Token: {token || "None"}</p>
                <p>Status: {trainer.status}</p>
                <p>Created: {trainer.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
