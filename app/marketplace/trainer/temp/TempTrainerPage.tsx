"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Clock, Award, Star } from "lucide-react"
import type { TrainerData } from "@/lib/firebase-trainer"

interface TempTrainerPageProps {
  trainer: TrainerData
}

export default function TempTrainerPage({ trainer }: TempTrainerPageProps) {
  const handlePayment = () => {
    // Redirect to payment page with trainer ID
    window.location.href = `/payment?trainerId=${trainer.id}&type=trainer-activation`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Preview Your Trainer Profile</h1>
          <p className="text-lg text-gray-600">This is how your profile will appear to potential clients</p>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {trainer.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <CardTitle className="text-2xl">{trainer.fullName}</CardTitle>
                <p className="text-green-100 text-lg">{trainer.specialty}</p>
                <div className="flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{trainer.location}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {trainer.bio ||
                      "Passionate fitness professional dedicated to helping clients achieve their health and wellness goals."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Experience
                  </h3>
                  <Badge variant="secondary" className="text-sm">
                    {trainer.experience}
                  </Badge>
                </div>

                {trainer.certifications && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-green-500" />
                      Certifications
                    </h3>
                    <p className="text-gray-700">{trainer.certifications}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{trainer.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{trainer.phone}</span>
                    </div>
                  </div>
                </div>

                {trainer.services && trainer.services.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="shadow-lg border-green-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Activate Your Profile?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Your trainer profile looks great! Complete the activation process to make it live and start connecting
              with potential clients.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handlePayment}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
              >
                Activate Profile - $29/month
              </Button>

              <p className="text-sm text-gray-500">Cancel anytime • 7-day free trial • No setup fees</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Info */}
        <div className="mt-6 text-center">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Preview Mode - Profile Not Yet Live
          </Badge>
        </div>
      </div>
    </div>
  )
}
