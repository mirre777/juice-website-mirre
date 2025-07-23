"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, MailIcon, PhoneIcon, ClockIcon, CheckCircleIcon } from "lucide-react"

// Define the trainer data interface
export interface TrainerProfileData {
  id?: string
  name: string
  specialty?: string
  experience?: string
  location?: string
  email?: string
  phone?: string
  bio?: string
  certifications?: string[]
  services?: string[]
  availability?: {
    weekdays?: string
    saturday?: string
    sunday?: string
  }
  rating?: {
    score: number
    count: number
  }
  heroTitle?: string
  heroSubtitle?: string
}

// Props for the component
export interface TrainerProfileDisplayProps {
  data: TrainerProfileData
  mode: "live" | "temp"
  onBookConsultation?: () => void
  onActivate?: () => void
  countdownTime?: string
  activationPrice?: string
}

export function TrainerProfileDisplay({
  data,
  mode = "live",
  onBookConsultation,
  onActivate,
  countdownTime,
  activationPrice = "€70",
}: TrainerProfileDisplayProps) {
  const [activeTab, setActiveTab] = useState("about")

  // Default values for missing data
  const {
    name = "Trainer Name",
    specialty = "Fitness Specialist",
    experience = "1-2 years",
    location = "Online",
    email,
    phone,
    bio = "No bio available",
    certifications = [],
    services = [],
    availability = {
      weekdays: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 3:00 PM",
      sunday: "Closed",
    },
    rating = { score: 5.0, count: 0 },
    heroTitle,
    heroSubtitle,
  } = data

  // Generate stars for rating
  const renderStars = (score: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-yellow-400 ${i < Math.floor(score) ? "opacity-100" : "opacity-30"}`}>
          ★
        </span>
      ))
  }

  return (
    <div className="flex flex-col w-full">
      {/* Preview banner for temp mode */}
      {mode === "temp" && (
        <div className="bg-white shadow-md p-4 mb-6 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-lime-400 rounded-full p-2">
              <ClockIcon className="h-5 w-5 text-gray-800" />
            </div>
            <div>
              <h3 className="font-medium">Preview Expires In</h3>
              <p className="text-sm text-gray-600">Activate now to make your website live</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lime-400 font-bold">{countdownTime || "23h 59m 49s"}</span>
            <Button onClick={onActivate} className="bg-lime-400 hover:bg-lime-500 text-black">
              Activate Now - {activationPrice}
            </Button>
          </div>
        </div>
      )}

      {/* Status bar for live mode */}
      {mode === "live" && (
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex gap-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Live</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Active Profile</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1 bg-transparent">
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-1 bg-transparent">
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-6">
        <div className="max-w-4xl mx-auto text-center py-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {heroTitle || `Transform Your Fitness with ${name}`}
          </h1>
          <p className="text-xl mb-6">
            {heroSubtitle || `Professional ${specialty} trainer with ${experience} of experience`}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-full">
              <CalendarIcon className="mr-1 h-4 w-4" /> {experience} Experience
            </Badge>

            {location && (
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-full">
                <MapPinIcon className="mr-1 h-4 w-4" /> {location}
              </Badge>
            )}

            {specialty && (
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-full">
                <CheckCircleIcon className="mr-1 h-4 w-4" /> {specialty}
              </Badge>
            )}
          </div>

          <Button onClick={onBookConsultation} className="bg-white text-blue-600 hover:bg-blue-50">
            Book Free Consultation
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About and Services */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">About {name}</h2>
              </div>

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <div>
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {cert}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              <p className="text-gray-700">{bio}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Services Offered</h2>

              {services && services.length > 0 ? (
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No services listed</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Contact, Stats */}
        <div className="space-y-6">
          {/* Contact */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Let's Start Your Fitness Journey</h2>

              {email && (
                <div className="flex items-center gap-2 mb-3">
                  <MailIcon className="h-5 w-5 text-gray-500" />
                  <span>{email}</span>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-2 mb-3">
                  <PhoneIcon className="h-5 w-5 text-gray-500" />
                  <span>{phone}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <span>{location}</span>
                </div>
              )}

              <Button onClick={onBookConsultation} className="w-full bg-black text-white hover:bg-gray-800">
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{experience}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-medium">{specialty}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-medium">{services.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Availability</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mon - Fri</span>
                  <span className="font-medium">{availability.weekdays}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">{availability.saturday}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">{availability.sunday}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activation CTA for temp mode */}
      {mode === "temp" && (
        <div className="mt-12 bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Make Your Website Live?</h2>
          <p className="text-gray-600 mb-6">One-time activation fee • No monthly costs • Full ownership</p>

          <Button onClick={onActivate} className="bg-lime-400 hover:bg-lime-500 text-black">
            Activate Website - {activationPrice}
          </Button>
        </div>
      )}
    </div>
  )
}
