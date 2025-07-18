"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

interface TrainerData {
  id: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  specialty?: string
  experience?: string
  bio?: string
  certifications?: string
  services?: string[]
  content?: {
    about?: {
      title?: string
      content?: string
      specialty?: string
    }
    contact?: {
      title?: string
      description?: string
      email?: string
      phone?: string
      location?: string
      fullName?: string
    }
    customization?: {
      isDraft?: boolean
    }
  }
  status?: string
  isActive?: boolean
  isPaid?: boolean
  createdAt?: any
  updatedAt?: any
}

interface TempTrainerPageProps {
  trainer?: TrainerData
  tempId: string
  token?: string
}

export default function TempTrainerPage({ trainer: initialTrainer, tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(initialTrainer || null)
  const [loading, setLoading] = useState(!initialTrainer)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialTrainer) {
      fetchTrainerData()
    }
  }, [tempId, initialTrainer])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/temp/${tempId}`)
      const data = await response.json()

      if (data.success) {
        setTrainer(data.trainer)
      } else {
        setError(data.error || "Failed to load trainer data")
      }
    } catch (err) {
      console.error("Error fetching trainer:", err)
      setError("Failed to load trainer data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer preview...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Trainer not found"}</p>
          <Link href="/marketplace/personal-trainer-website">
            <Button>Back to Form</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Extract data with fallbacks for both old and new structure
  const getName = () => {
    return trainer.content?.contact?.fullName || trainer.fullName || "Professional Trainer"
  }

  const getEmail = () => {
    return trainer.content?.contact?.email || trainer.email || ""
  }

  const getPhone = () => {
    return trainer.content?.contact?.phone || trainer.phone || ""
  }

  const getLocation = () => {
    return trainer.content?.contact?.location || trainer.location || ""
  }

  const getSpecialty = () => {
    return trainer.content?.about?.specialty || trainer.specialty || "Fitness Training"
  }

  const getBio = () => {
    return (
      trainer.content?.about?.content ||
      trainer.bio ||
      "Passionate fitness professional dedicated to helping clients achieve their goals."
    )
  }

  const getServices = () => {
    return trainer.services || ["Personal Training", "Fitness Consultation"]
  }

  const getCertifications = () => {
    return trainer.certifications || "Certified Fitness Professional"
  }

  const getExperience = () => {
    return trainer.experience || "1+ years"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">{getName().charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getName()}</h1>
                <p className="text-gray-600">{getSpecialty()}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Preview Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-juice" />
                  <span>About {getName().split(" ")[0]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{getBio()}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Experience:</span>
                    <p className="text-gray-600">{getExperience()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Specialty:</span>
                    <p className="text-gray-600">{getSpecialty()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-juice" />
                  <span>Services Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getServices().map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{getCertifications()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getEmail() && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{getEmail()}</span>
                  </div>
                )}
                {getPhone() && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{getPhone()}</span>
                  </div>
                )}
                {getLocation() && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{getLocation()}</span>
                  </div>
                )}
                <Button className="w-full bg-juice hover:bg-juice/90 text-black">
                  Contact {getName().split(" ")[0]}
                </Button>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Status:</span>
                    <Badge variant={trainer.isActive ? "default" : "secondary"}>
                      {trainer.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <Badge variant={trainer.isPaid ? "default" : "destructive"}>
                      {trainer.isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/marketplace/personal-trainer-website">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          {!trainer.isPaid && (
            <Link href={`/payment?trainerId=${trainer.id}`}>
              <Button className="bg-juice hover:bg-juice/90 text-black">Activate Profile - €70</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
