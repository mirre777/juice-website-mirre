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
  services: string[]
  createdAt: string
  expiresAt: string
}

interface TempTrainerPageProps {
  tempId: string
  token: string
}

export default function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchTrainerData = async () => {
      try {
        console.log("Fetching trainer data for tempId:", tempId, "with token:", token)

        const response = await fetch(`/api/trainer/temp/${tempId}?token=${token}`)
        console.log("API Response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API Error:", errorData)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response data:", data)

        if (data.success && data.trainer) {
          setTrainer(data.trainer)
        } else {
          throw new Error(data.error || "Failed to fetch trainer data")
        }
      } catch (err) {
        console.error("Error fetching trainer data:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer data")
      } finally {
        setLoading(false)
      }
    }

    // Show loading screen for 3 seconds, then fetch data
    const timer = setTimeout(() => {
      fetchTrainerData()
    }, 3000)

    return () => clearTimeout(timer)
  }, [tempId, token, mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <div className="absolute top-4 right-4 text-2xl">✨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI is generating your website...</h2>
          <p className="text-gray-600 mb-6">Creating a personalized trainer website based on your profile</p>
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
          </div>
          <p className="text-sm text-gray-500">This usually takes 2-3 seconds</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-8 text-center">
          <div className="text-red-500 mb-4">
            <CheckCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Preview</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#D2FF28] text-black hover:bg-[#B8E625]">
            Try Again
          </Button>
        </Card>
      </div>
    )
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

  const handleActivate = () => {
    // Redirect to payment page with trainer data
    window.location.href = `/payment?tempId=${tempId}&token=${token}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Trial expires in: Expired</span>
            <Badge variant="outline" className="text-xs">
              Preview Mode
            </Badge>
          </div>
          <Button onClick={handleActivate} className="bg-[#D2FF28] text-black hover:bg-[#B8E625] font-semibold px-6">
            Activate Website - €70
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Fitness with {trainer.fullName}</h1>
          <p className="text-xl mb-6">
            Professional {trainer.specialty} trainer in {trainer.location}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {trainer.experience} Experience
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              {trainer.location}
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              {trainer.specialty}
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
                  About {trainer.fullName}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 break-words overflow-wrap-anywhere">{trainer.bio}</p>

                {trainer.certifications && (
                  <div>
                    <h3 className="font-semibold mb-2">Certifications</h3>
                    <p className="text-gray-600 break-words overflow-wrap-anywhere">{trainer.certifications}</p>
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
                  {trainer.services.map((service, index) => (
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
                      "Working with {trainer.fullName} has completely transformed my fitness journey. Their expertise in{" "}
                      {trainer.specialty.toLowerCase()} is unmatched!"
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
                    <span className="text-gray-700 break-all">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 break-words">{trainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 break-words">{trainer.location}</span>
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
                    <span className="font-medium break-words">{trainer.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium break-words">{trainer.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium break-words">{trainer.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{trainer.services.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-[#D2FF28]">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Ready to Go Live?</h3>
                <p className="text-black/80 mb-4">Activate your website now and start attracting clients today!</p>
                <Button onClick={handleActivate} className="w-full bg-black text-white hover:bg-gray-800">
                  Activate for €70
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
