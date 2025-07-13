"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  Clock,
  Users,
  Award,
  Phone,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Calendar,
  Dumbbell,
  Target,
  Heart,
} from "lucide-react"
import Link from "next/link"

interface TempTrainerData {
  id: string
  name: string
  title: string
  location: string
  rating: number
  reviewCount: number
  experience: string
  specialties: string[]
  bio: string
  services: Array<{
    name: string
    description: string
    price: string
    duration: string
  }>
  certifications: string[]
  contact: {
    phone: string
    email: string
    instagram?: string
    facebook?: string
  }
  availability: string[]
  profileImage: string
  galleryImages: string[]
}

export default function TempTrainerPage({ tempId }: { tempId: string }) {
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        if (response.ok) {
          const data = await response.json()
          setTrainer(data)
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600 mb-8">The trainer profile you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>Browse All Trainers</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={trainer.profileImage || "/placeholder.svg"} alt={trainer.name} />
              <AvatarFallback className="text-2xl bg-blue-500">
                {trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center lg:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{trainer.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{trainer.title}</p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>
                    {trainer.rating} ({trainer.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{trainer.experience} experience</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {trainer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  About {trainer.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-blue-600" />
                  Training Services
                </CardTitle>
                <CardDescription>Choose from a variety of personalized training options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trainer.services.map((service, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedService === service.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{service.price}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      {selectedService === service.name && (
                        <div className="mt-4 pt-4 border-t">
                          <Button className="w-full">Book {service.name}</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Certifications & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trainer.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  <span>{trainer.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="break-all">{trainer.contact.email}</span>
                </div>

                {(trainer.contact.instagram || trainer.contact.facebook) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {trainer.contact.instagram && (
                        <div className="flex items-center">
                          <Instagram className="w-4 h-4 mr-3 text-pink-500" />
                          <Link
                            href={`https://instagram.com/${trainer.contact.instagram}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                          >
                            @{trainer.contact.instagram}
                          </Link>
                        </div>
                      )}
                      {trainer.contact.facebook && (
                        <div className="flex items-center">
                          <Facebook className="w-4 h-4 mr-3 text-blue-500" />
                          <Link
                            href={trainer.contact.facebook}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                          >
                            Facebook Profile
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trainer.availability.map((slot, index) => (
                    <div key={index} className="flex items-center p-2 bg-green-50 rounded">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{slot}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
                <CardDescription>Take the first step towards your fitness goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Trainer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
