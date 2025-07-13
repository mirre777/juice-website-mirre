"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Star, Mail, Phone, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Trainer, Service } from "@/types/trainer"

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainer()
  }, [trainerId])

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainer(data)
      } else if (response.status === 404) {
        setError("Trainer not found")
      } else {
        setError("Failed to load trainer profile")
      }
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError("Error loading trainer profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Trainer Not Found"}</h2>
          <p className="text-gray-600 mb-6">
            The trainer profile you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link href="/marketplace">
            <Button>Browse All Trainers</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Floating Profile Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {trainer.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{trainer.heroTitle || trainer.name}</h1>
                    <p className="text-blue-100 text-lg">
                      {trainer.heroSubtitle || `${trainer.specialization} Trainer`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trainer.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {trainer.experience} years experience
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {trainer.specialization}
                  </div>
                </div>
              </div>

              {/* Edit Button for Active Trainers */}
              {trainer.status === "active" && (
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Content
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-8">
            {/* About Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{trainer.aboutTitle || "About Me"}</h2>
              <p className="text-gray-700 leading-relaxed">{trainer.aboutContent || trainer.bio}</p>
            </section>

            <Separator className="my-8" />

            {/* Services Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainer.services?.map((service: Service) => (
                  <Card key={service.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
                        <Badge variant="outline" className="ml-2">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>€{service.price}</span>
                          <span>•</span>
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{trainer.contactTitle || "Get in Touch"}</h2>
              <p className="text-gray-700 mb-6">
                {trainer.contactDescription ||
                  "Ready to start your fitness journey? Contact me to schedule your first session."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Contact: {trainer.email}</span>
                  <span>Location: {trainer.location}</span>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Back to Marketplace */}
        <div className="text-center mt-8">
          <Link href="/marketplace">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse More Trainers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
