"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Clock, DollarSign, Users, Award, Phone, Mail, MessageSquare } from "lucide-react"

interface TempTrainer {
  id: string
  name: string
  title: string
  location: string
  rating: number
  reviewCount: number
  hourlyRate: number
  experience: string
  avatar: string
  specializations: string[]
  bio: string
  services: Array<{
    name: string
    description: string
    price: number
    duration: string
  }>
  availability: string[]
  certifications: string[]
  contact: {
    phone: string
    email: string
  }
}

export default function TempTrainerPage() {
  const [trainer, setTrainer] = useState<TempTrainer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch temp trainer data
    const fetchTempTrainer = async () => {
      try {
        // This would normally be an API call
        const tempTrainerData: TempTrainer = {
          id: "temp-trainer-001",
          name: "Alex Johnson",
          title: "Certified Personal Trainer & Nutrition Coach",
          location: "San Francisco, CA",
          rating: 4.9,
          reviewCount: 127,
          hourlyRate: 85,
          experience: "8+ years",
          avatar: "/placeholder-user.jpg",
          specializations: ["Weight Loss", "Strength Training", "Nutrition Coaching", "HIIT"],
          bio: "Passionate fitness professional dedicated to helping clients achieve their health and wellness goals. Specializing in sustainable weight loss, strength building, and lifestyle transformation through personalized training programs.",
          services: [
            {
              name: "Personal Training Session",
              description: "One-on-one training session tailored to your fitness goals",
              price: 85,
              duration: "60 minutes",
            },
            {
              name: "Nutrition Consultation",
              description: "Comprehensive nutrition assessment and meal planning",
              price: 65,
              duration: "45 minutes",
            },
            {
              name: "Fitness Assessment",
              description: "Complete fitness evaluation and goal setting session",
              price: 50,
              duration: "30 minutes",
            },
          ],
          availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          certifications: ["NASM-CPT", "Precision Nutrition Level 1", "TRX Certified"],
          contact: {
            phone: "+1 (555) 123-4567",
            email: "alex.johnson@email.com",
          },
        }

        setTrainer(tempTrainerData)
      } catch (error) {
        console.error("Error fetching temp trainer:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTempTrainer()
  }, [])

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Not Found</h1>
          <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src={trainer.avatar || "/placeholder.svg"} alt={trainer.name} />
              <AvatarFallback className="text-2xl bg-blue-500">
                {trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{trainer.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{trainer.title}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {trainer.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {trainer.rating} ({trainer.reviewCount} reviews)
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {trainer.experience} experience
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />${trainer.hourlyRate}/hour
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <MessageSquare className="h-4 w-4 mr-2" />
                Book Session
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
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
                <CardTitle>About {trainer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trainer.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainer.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">${service.price}</div>
                        <div className="text-sm text-gray-500">{service.duration}</div>
                      </div>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                    <Button className="mt-3" size="sm">
                      Book Now
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trainer.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{trainer.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{trainer.contact.email}</span>
                </div>
                <Separator />
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trainer.availability.map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="font-medium">{day}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Available
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Clients Trained</span>
                  </div>
                  <span className="font-bold">200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span>Average Rating</span>
                  </div>
                  <span className="font-bold">{trainer.rating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Response Time</span>
                  </div>
                  <span className="font-bold">&lt; 2 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
