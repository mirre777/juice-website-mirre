"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Mail, MapPin, Phone, Star, CheckCircle } from "lucide-react"

interface TempTrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services?: string[]
  createdAt: string
  expiresAt: string
}

interface TempTrainerPageProps {
  trainer: TempTrainerData
}

export default function TempTrainerPage({ trainer }: TempTrainerPageProps) {
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isExpired, setIsExpired] = useState(false)

  // Format countdown timer
  const formatCountdown = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Expired"

    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours}h ${minutes}m ${seconds}s`
  }

  // Update countdown timer
  useEffect(() => {
    if (!trainer?.expiresAt) {
      setTimeRemaining("Invalid date")
      setIsExpired(true)
      return
    }

    const updateCountdown = () => {
      try {
        const now = new Date().getTime()
        const expiresAt = new Date(trainer.expiresAt).getTime()
        const difference = expiresAt - now

        if (difference <= 0) {
          setTimeRemaining("Expired")
          setIsExpired(true)
        } else {
          setTimeRemaining(formatCountdown(difference))
          setIsExpired(false)
        }
      } catch (error) {
        console.error("Error updating countdown:", error)
        setTimeRemaining("Invalid date")
        setIsExpired(true)
      }
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [trainer?.expiresAt])

  const handleActivate = () => {
    // Redirect to payment page with trainer data
    window.location.href = `/payment?tempId=${trainer.id}&token=${new URLSearchParams(window.location.search).get("token") || ""}`
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trainer Not Found</h2>
          <p className="text-gray-600">This preview may have expired or is invalid.</p>
        </Card>
      </div>
    )
  }

  // Default services if none provided
  const defaultServices = [
    "Personal Training Sessions",
    "Fitness Assessments",
    "Custom Workout Plans",
    "Nutritional Guidance",
    "Group Training Classes",
  ]

  const services = trainer.services && trainer.services.length > 0 ? trainer.services : defaultServices

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Trial expires in: {isExpired ? "Expired" : timeRemaining}
            </span>
            <Badge variant="outline" className="text-xs">
              Preview Mode
            </Badge>
          </div>
          <Button
            onClick={handleActivate}
            className="bg-[#D2FF28] text-black hover:bg-[#B8E625] font-semibold px-6"
            disabled={isExpired}
          >
            {isExpired ? "Trial Expired" : "Activate Website - €70"}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 break-words">
            Transform Your Fitness with {trainer.fullName || "Your Trainer"}
          </h1>
          <p className="text-xl mb-6 break-words">
            Professional {trainer.specialty || "fitness"} trainer in {trainer.location || "your area"}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {trainer.experience || "Experienced"} Experience
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              {trainer.location || "Local Area"}
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              {trainer.specialty || "Fitness Training"}
            </Badge>
          </div>

          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Book Free Consultation
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  About {trainer.fullName || "Your Trainer"}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 break-words overflow-wrap-anywhere">
                  {trainer.bio ||
                    "Passionate fitness professional dedicated to helping clients achieve their health and wellness goals through personalized training programs and expert guidance."}
                </p>

                {trainer.certifications && (
                  <div>
                    <h3 className="font-semibold mb-2">Certifications</h3>
                    <p className="text-gray-600 break-words">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Services Offered
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 break-words">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Client Testimonials
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-2 break-words">
                      "Working with {trainer.fullName || "this trainer"} has completely transformed my fitness journey.
                      Their expertise in {trainer.specialty?.toLowerCase() || "fitness training"} is unmatched!"
                    </p>
                    <p className="text-sm text-gray-500">- Sarah M.</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-2 break-words">
                      "Professional, knowledgeable, and motivating. I've achieved results I never thought possible!"
                    </p>
                    <p className="text-sm text-gray-500">- Mike R.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{trainer.email || "contact@trainer.com"}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 break-words">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 break-words">{trainer.location || "Local Area"}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium break-words">{trainer.experience || "Professional"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium break-words">{trainer.specialty || "Fitness Training"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium break-words">{trainer.location || "Local Area"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{services.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-[#D2FF28]">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Ready to Go Live?</h3>
                <p className="text-black/80 mb-4 break-words">
                  Activate your website now and start attracting clients today!
                </p>
                <Button
                  onClick={handleActivate}
                  className="w-full bg-black text-white hover:bg-gray-800"
                  disabled={isExpired}
                >
                  {isExpired ? "Trial Expired" : "Activate for €70"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
