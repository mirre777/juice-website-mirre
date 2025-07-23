"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, Mail, Phone, Star, Calendar, User, Award, Briefcase } from "lucide-react"

// Shared interfaces for trainer data
export interface TrainerData {
  id?: string
  tempId?: string
  fullName: string
  name?: string
  email: string
  phone?: string
  location: string
  specialty: string
  specialization?: string
  experience: string
  bio: string
  certifications?: string | string[]
  services?: string[]
  availability?: {
    [key: string]: string
  }
  rating?: number
  reviewCount?: number
  isActive?: boolean
  content?: {
    hero?: {
      title?: string
      subtitle?: string
      description?: string
    }
    about?: {
      title?: string
      content?: string
    }
    services?: Array<{
      title: string
      description: string
      price?: string
    }>
    testimonials?: Array<{
      name: string
      text: string
      rating: number
    }>
    contact?: {
      email: string
      phone?: string
      location: string
      availability?: string
    }
  }
}

export interface TrainerProfileDisplayProps {
  trainer: TrainerData
  mode: "live" | "temp"
  onBookConsultation?: () => void
  onScheduleConsultation?: () => void
  onActivateWebsite?: () => void
  onEditProfile?: () => void
  showEditControls?: boolean
  expiresAt?: Date
  sessionToken?: string
}

// Data transformation utilities
const transformTrainerData = (trainer: TrainerData) => {
  return {
    name: trainer.fullName || trainer.name || "Professional Trainer",
    email: trainer.email || "",
    phone: trainer.phone || "",
    location: trainer.location || "Location not specified",
    specialty: trainer.specialty || trainer.specialization || "Fitness Training",
    experience: trainer.experience || "Experienced",
    bio: trainer.bio || "Passionate fitness professional dedicated to helping clients achieve their goals.",
    certifications: Array.isArray(trainer.certifications)
      ? trainer.certifications
      : trainer.certifications
        ? [trainer.certifications]
        : [],
    services: trainer.services || [],
    rating: trainer.rating || 5.0,
    reviewCount: trainer.reviewCount || 24,
    availability: trainer.availability || {
      "Mon - Fri": "6:00 AM - 8:00 PM",
      Saturday: "8:00 AM - 6:00 PM",
      Sunday: "Closed",
    },
  }
}

export function TrainerProfileDisplay({
  trainer,
  mode,
  onBookConsultation,
  onScheduleConsultation,
  onActivateWebsite,
  onEditProfile,
  showEditControls = false,
  expiresAt,
  sessionToken,
}: TrainerProfileDisplayProps) {
  const transformedTrainer = transformTrainerData(trainer)
  const isTemp = mode === "temp"
  const isLive = mode === "live"

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format countdown timer
  const formatTimeLeft = (expiresAt: Date) => {
    const now = new Date()
    const timeLeft = expiresAt.getTime() - now.getTime()

    if (timeLeft <= 0) return "00h 00m 00s"

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner for Temp Mode */}
      {isTemp && expiresAt && (
        <div className="bg-yellow-400 border-b border-yellow-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preview Expires In</h3>
                  <p className="text-sm text-gray-700">Activate now to make your website live</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{formatTimeLeft(expiresAt)}</div>
                </div>
                {onActivateWebsite && (
                  <Button onClick={onActivateWebsite} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2">
                    ⚡ Activate Now - €70
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar for Live Mode */}
      {isLive && showEditControls && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Live
                </Badge>
                <span className="text-sm text-gray-600">Active Profile</span>
              </div>
              <div className="flex items-center space-x-3">
                {onEditProfile && (
                  <Button variant="outline" onClick={onEditProfile}>
                    Edit Profile
                  </Button>
                )}
                <Button variant="outline">Dashboard</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700" />
          <div className="relative px-8 py-12 text-center text-white">
            <div className="mb-6">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                  {getInitials(transformedTrainer.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Fitness with {transformedTrainer.name}
            </h1>

            <p className="text-xl mb-6 opacity-90">
              Professional {transformedTrainer.specialty} with {transformedTrainer.experience} of experience
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <User className="w-4 h-4 mr-2" />
                {transformedTrainer.experience} Experience
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <MapPin className="w-4 h-4 mr-2" />
                {transformedTrainer.location}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Award className="w-4 h-4 mr-2" />
                {transformedTrainer.specialty}
              </Badge>
            </div>

            {(onBookConsultation || onScheduleConsultation) && (
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100"
                onClick={onBookConsultation || onScheduleConsultation}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  <h2 className="text-2xl font-bold">About {transformedTrainer.name}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{transformedTrainer.bio}</p>

                {transformedTrainer.certifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {transformedTrainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
                  <h2 className="text-2xl font-bold">Services Offered</h2>
                </div>

                {transformedTrainer.services.length > 0 ? (
                  <div className="grid gap-4">
                    {transformedTrainer.services.map((service, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        <span className="font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Services information will be displayed here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Client Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {transformedTrainer.rating} ({transformedTrainer.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Sample testimonials */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-600 italic mb-2">
                      "Working with this trainer has completely transformed my approach to fitness. The personalized
                      programs really work!"
                    </p>
                    <p className="text-sm font-medium">- Sarah M.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-gray-600 italic mb-2">
                      "Professional, knowledgeable, and motivating. I've seen incredible results in just 3 months."
                    </p>
                    <p className="text-sm font-medium">- Mike R.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Let's Start Your Fitness Journey</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="text-sm">{transformedTrainer.email}</span>
                  </div>
                  {transformedTrainer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3" />
                      <span className="text-sm">{transformedTrainer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span className="text-sm">{transformedTrainer.location}</span>
                  </div>
                </div>

                {(onScheduleConsultation || onBookConsultation) && (
                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    onClick={onScheduleConsultation || onBookConsultation}
                  >
                    Schedule Consultation
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{transformedTrainer.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium">{transformedTrainer.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{transformedTrainer.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{transformedTrainer.services.length || 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Availability</h3>
                <div className="space-y-2">
                  {Object.entries(transformedTrainer.availability).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA for Temp Mode */}
        {isTemp && onActivateWebsite && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Make Your Website Live?</h2>
              <p className="text-gray-600 mb-6">One-time activation fee • No monthly costs • Full ownership</p>
              <Button
                size="lg"
                onClick={onActivateWebsite}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
              >
                ⚡ Activate Website - €70
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
