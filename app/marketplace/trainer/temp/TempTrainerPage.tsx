"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Users, Award } from "lucide-react"

interface TempTrainerPageProps {
  tempId: string
}

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  bio: string
  experience: string
  specialty: string
  certifications: string
  services: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  createdAt: any
  expiresAt: any
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        if (!response.ok) {
          throw new Error("Trainer not found")
        }
        const data = await response.json()
        setTrainer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trainer")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainer()
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-black rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "This trainer profile could not be found"}</p>
          <a
            href="/marketplace/personal-trainer-website"
            className="inline-flex items-center px-4 py-2 bg-[#D2FF28] text-black rounded-lg hover:bg-[#D2FF28]/90"
          >
            Return to Form
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trainer.fullName}</h1>
              <p className="text-lg text-gray-600">{trainer.specialty}</p>
            </div>
            <Badge variant={trainer.isActive ? "default" : "secondary"}>
              {trainer.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trainer.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#D2FF28]">{trainer.experience}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{trainer.certifications}</p>
                </CardContent>
              </Card>
            </div>
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
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{trainer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{trainer.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={trainer.isActive ? "default" : "secondary"}>{trainer.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <Badge variant={trainer.isPaid ? "default" : "destructive"}>
                    {trainer.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">Contact Trainer</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
