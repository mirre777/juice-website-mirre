"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { TrainerDocument } from "@/lib/firebase-trainer"

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerDocument | null>(null)
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

        if (data.success) {
          setTrainer(data.trainer)
        } else {
          throw new Error(data.error || "Failed to load trainer")
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/marketplace">Back to Marketplace</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Trainer not found</p>
            <Button variant="outline" asChild>
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Website Preview</h1>
                <p className="text-sm text-gray-600">Your trainer website is ready for review</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Preview Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Hero Section */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">
                    {trainer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainer.fullName}</h1>
                <p className="text-xl text-blue-600 mb-4">{trainer.specialty} Specialist</p>
                <div className="flex items-center justify-center space-x-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{trainer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trainer.experience}</span>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mb-6">
                  {trainer.services?.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
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
              {trainer.certifications && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Certifications & Qualifications</h4>
                  <p className="text-gray-700">{trainer.certifications}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Training Session</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    One-on-one personalized training session focused on your specific goals
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">€60</span>
                    <span className="text-sm text-gray-500">60 minutes</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Fitness Assessment</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Comprehensive fitness evaluation and goal-setting session
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">€40</span>
                    <span className="text-sm text-gray-500">45 minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{trainer.email}</p>
                  </div>
                </div>
                {trainer.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{trainer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Activate Your Website?</h3>
              <p className="text-gray-600 mb-6">
                Your website preview looks great! Activate it now for just €70 and start attracting clients.
              </p>
              <div className="space-y-3">
                <Button size="lg" className="w-full md:w-auto">
                  Activate Website - €70
                </Button>
                <p className="text-sm text-gray-500">
                  24-hour preview expires on{" "}
                  {trainer.expiresAt ? new Date(trainer.expiresAt).toLocaleDateString() : "soon"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
