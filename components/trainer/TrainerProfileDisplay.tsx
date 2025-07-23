"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Award, Star, Phone, Mail, Calendar, Timer, Zap, Edit, MessageCircle } from "lucide-react"

// Core trainer data interface
export interface DisplayTrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  city: string
  district?: string
  specialty: string
  bio?: string
  certifications?: string
  services: string[]
  profileImage?: string
  status: string
  isActive: boolean
  isPaid: boolean
}

// Service structure for display
export interface DisplayService {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

// Content structure for flexible display
export interface DisplayTrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    bio: string
  }
  contact: {
    title: string
    description: string
    phone: string
    email: string
    location: string
  }
  services: DisplayService[]
}

// Component props interface
interface TrainerProfileDisplayProps {
  trainer: DisplayTrainerData
  content: DisplayTrainerContent
  mode: "live" | "temp"
  isEditable?: boolean
  timeLeft?: string
  isExpired?: boolean
  activationPrice?: string
  onEdit?: () => void
  onBookConsultation?: () => void
  onScheduleSession?: (serviceId: string) => void
  onSendMessage?: () => void
  onActivate?: () => void
}

export default function TrainerProfileDisplay({
  trainer,
  content,
  mode,
  isEditable = false,
  timeLeft,
  isExpired = false,
  activationPrice = "€70",
  onEdit,
  onBookConsultation,
  onScheduleSession,
  onSendMessage,
  onActivate,
}: TrainerProfileDisplayProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // Fallback data for missing information
  const displayName = trainer.fullName || "Professional Trainer"
  const displayLocation = trainer.city
    ? `${trainer.city}${trainer.district ? `, ${trainer.district}` : ""}`
    : "Available Online"
  const displaySpecialty = trainer.specialty || "Fitness Training"
  const displayBio =
    content.about.bio ||
    trainer.bio ||
    `Professional ${displaySpecialty.toLowerCase()} trainer dedicated to helping clients achieve their fitness goals.`

  // Generate certifications array
  const certifications = trainer.certifications
    ? typeof trainer.certifications === "string"
      ? [trainer.certifications]
      : trainer.certifications
    : ["Certified Personal Trainer"]

  // Generate services with fallbacks
  const displayServices =
    content.services.length > 0
      ? content.services
      : [
          {
            id: "consultation",
            title: "Free Consultation",
            description: "Initial assessment and goal-setting session",
            price: 0,
            duration: "30 minutes",
            featured: true,
          },
          {
            id: "training",
            title: "Personal Training",
            description: "One-on-one training session",
            price: 80,
            duration: "60 minutes",
            featured: false,
          },
        ]

  return (
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Temp Mode: Timer Banner */}
        {mode === "temp" && timeLeft && (
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
                  <div className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-[#D2FF28]"}`}>
                    {timeLeft}
                  </div>
                  {!isExpired && onActivate && (
                    <Button
                      onClick={onActivate}
                      className="mt-2 bg-[#D2FF28] text-black hover:bg-[#c5f01f] font-semibold"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Activate Now - {activationPrice}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Mode: Edit Controls */}
        {mode === "live" && isEditable && onEdit && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Edit Mode Available</span>
                </div>
                <Button onClick={onEdit} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
                    {trainer.profileImage ? (
                      <img
                        src={trainer.profileImage || "/placeholder.svg"}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-black">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-black mb-2">{displayName}</h1>
                  <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    {displaySpecialty}
                  </p>
                  <p className="text-gray-600 flex items-center justify-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {displayLocation}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Badge variant="secondary" className="bg-[#D2FF28]/10 text-[#D2FF28] border-[#D2FF28]/20">
                    {displaySpecialty}
                  </Badge>
                  {mode === "live" && trainer.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
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
                <CardTitle className="text-black">{content.about.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{displayBio}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 rounded-lg border ${
                        service.featured ? "border-[#D2FF28] bg-[#D2FF28]/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-black">{service.title}</h3>
                        <div className="text-right">
                          <div className="font-bold text-black">
                            {service.price === 0 ? "Free" : `€${service.price}`}
                          </div>
                          <div className="text-sm text-gray-600">{service.duration}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <Button
                        onClick={() => {
                          setSelectedService(service.id)
                          if (onScheduleSession) {
                            onScheduleSession(service.id)
                          }
                        }}
                        className={`w-full ${
                          service.featured
                            ? "bg-[#D2FF28] text-black hover:bg-[#c5f01f]"
                            : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                        }`}
                        variant={service.featured ? "default" : "outline"}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {service.price === 0 ? "Book Free Session" : "Schedule Session"}
                      </Button>
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
                <CardTitle className="text-black">{content.contact.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{content.contact.description}</p>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D2FF28]" />
                  <span className="text-gray-700">{content.contact.email}</span>
                </div>

                {content.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D2FF28]" />
                    <span className="text-gray-700">{content.contact.phone}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  {onBookConsultation && (
                    <Button onClick={onBookConsultation} className="w-full bg-[#D2FF28] text-black hover:bg-[#c5f01f]">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                  )}

                  {onSendMessage && (
                    <Button onClick={onSendMessage} variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  )}
                </div>
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

        {/* Bottom CTA for Temp Mode */}
        {mode === "temp" && !isExpired && onActivate && (
          <Card className="mt-8 bg-[#D2FF28]/5 border-[#D2FF28]/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-black mb-2">Ready to Make Your Website Live?</h3>
              <p className="text-gray-600 mb-4">One-time activation fee • No monthly costs • Full ownership</p>
              <Button
                onClick={onActivate}
                size="lg"
                className="bg-[#D2FF28] text-black hover:bg-[#c5f01f] font-semibold px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                Activate Website - {activationPrice}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
