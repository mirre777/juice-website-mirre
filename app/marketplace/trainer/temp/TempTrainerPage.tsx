"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Award, Star, CheckCircle, Phone, Mail, Calendar, Timer, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

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
  createdAt: string
  expiresAt?: string
  sessionToken?: string
}

interface TempTrainerPageProps {
  trainer: TrainerData
  token?: string
}

export default function TempTrainerPage({ trainer, token }: TempTrainerPageProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  // Countdown timer
  useEffect(() => {
    // Set expiry to 24 hours from creation if not set
    const expiryTime = trainer?.expiresAt
      ? new Date(trainer.expiresAt).getTime()
      : new Date(trainer.createdAt).getTime() + 24 * 60 * 60 * 1000

    const updateCountdown = () => {
      try {
        const now = new Date().getTime()
        const difference = expiryTime - now

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          setIsExpired(false)
        } else {
          setTimeLeft("Expired")
          setIsExpired(true)
        }
      } catch (error) {
        console.error("Error calculating countdown:", error)
        setTimeLeft("--")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [trainer?.expiresAt, trainer?.createdAt])

  const handleActivate = () => {
    if (trainer?.id) {
      router.push(`/payment?tempId=${trainer.id}${token ? `&token=${encodeURIComponent(token)}` : ""}`)
    }
  }

  const services = trainer?.services || [
    "Personal Training Sessions",
    "Nutrition Coaching",
    "Workout Plan Design",
    "Progress Tracking",
  ]

  const specialties = [trainer?.specialty || "Fitness Training"]

  const certifications = trainer?.certifications
    ? typeof trainer.certifications === "string"
      ? [trainer.certifications]
      : trainer.certifications
    : ["Certified Personal Trainer", "Nutrition Specialist"]

  return (
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D2FF28] rounded-full flex items-center justify-center">
                  <Timer className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">Preview Expires In</h2>
                  <p className="text-sm text-gray-600">Activate now to make your website live</p>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-[#D2FF28]"}`}>{timeLeft}</div>
                {!isExpired && (
                  <Button
                    onClick={handleActivate}
                    className="mt-2 bg-[#D2FF28] text-black hover:bg-[#c5f01f] font-semibold"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Activate Now - €70
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-black">
                      {(trainer?.fullName || "T").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-black mb-2">{trainer?.fullName || "Personal Trainer"}</h1>
                  <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    {trainer?.specialty || "Fitness Specialist"} • {trainer?.experience || "5+ years"}
                  </p>
                  <p className="text-gray-600 flex items-center justify-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {trainer?.location || "Available Online"}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#D2FF28]/10 text-[#D2FF28] border-[#D2FF28]/20"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-gray-600">5.0 (24 reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {trainer?.bio ||
                    `Passionate ${trainer?.specialty || "fitness"} trainer with ${trainer?.experience || "5+ years"} of experience helping clients achieve their health and fitness goals. I believe in creating personalized workout plans that fit your lifestyle and help you build sustainable healthy habits.`}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-gray-700">{trainer?.email || "contact@trainer.com"}</span>
                </div>
                {trainer?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D2FF28]" />
                    <span className="text-gray-700">{trainer.phone}</span>
                  </div>
                )}
                <Separator />
                <Button className="w-full bg-[#D2FF28] text-black hover:bg-[#c5f01f]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-[#D2FF28]" />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mon - Fri</span>
                    <span className="text-gray-700">6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-700">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-700">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        {!isExpired && (
          <Card className="mt-8 bg-[#D2FF28]/5 border-[#D2FF28]/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-black mb-2">Ready to Make Your Website Live?</h3>
              <p className="text-gray-600 mb-4">One-time activation fee • No monthly costs • Full ownership</p>
              <Button
                onClick={handleActivate}
                size="lg"
                className="bg-[#D2FF28] text-black hover:bg-[#c5f01f] font-semibold px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                Activate Website - €70
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
