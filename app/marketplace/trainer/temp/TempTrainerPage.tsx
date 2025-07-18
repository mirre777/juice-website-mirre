"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

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
  services?: string[]
  status: string
  createdAt: string
  expiresAt?: string
}

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrainer() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/trainer/temp/${tempId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load trainer")
        }

        if (data.success && data.trainer) {
          setTrainer(data.trainer)
        } else {
          throw new Error("Trainer not found")
        }
      } catch (err) {
        console.error("Error fetching trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTrainer()
    }
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer preview...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error || "Failed to load trainer preview"}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
              <Link href="/marketplace" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Marketplace
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timeRemaining = trainer.expiresAt
    ? Math.max(0, Math.floor((new Date(trainer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="text-blue-600 hover:text-blue-700">
              ← Back to Marketplace
            </Link>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Preview expires in {timeRemaining}h
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Website Preview Created!</h3>
                <p className="text-green-700">
                  Your trainer website preview is ready. Complete payment to activate it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trainer Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {trainer.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainer.fullName}</h1>
                  <p className="text-xl text-blue-600 mb-2">{trainer.specialty} Specialist</p>
                  <div className="flex items-center justify-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {trainer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {trainer.experience} experience
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Services */}
            {trainer.services && trainer.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {trainer.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {trainer.certifications && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{trainer.certifications}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{trainer.email}</span>
                </div>
                {trainer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{trainer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{trainer.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Activation CTA */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Activate Your Website</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Complete payment to make your website live and start accepting clients.
                </p>
                <Button className="w-full" size="lg">
                  Activate for €70
                </Button>
                <p className="text-xs text-blue-600 mt-2 text-center">One-time payment • No monthly fees</p>
              </CardContent>
            </Card>

            {/* Preview Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <h4 className="font-medium text-amber-900 mb-2">Preview Mode</h4>
                <p className="text-amber-700 text-sm">
                  This is a preview of your trainer website. It will expire in {timeRemaining} hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
