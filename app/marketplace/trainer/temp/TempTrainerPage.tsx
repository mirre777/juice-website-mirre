"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Award, Phone, Mail, Globe, Instagram, Facebook, Twitter } from "lucide-react"

interface TempTrainerPageProps {
  tempId: string
}

interface TrainerData {
  id: string
  name: string
  specialties: string[]
  location: string
  experience: string
  bio: string
  certifications: string[]
  pricing: {
    sessionRate: string
    packageDeals: string[]
  }
  availability: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
    social?: {
      instagram?: string
      facebook?: string
      twitter?: string
    }
  }
  rating: number
  reviewCount: number
  profileImage: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch trainer data")
        }
        const data = await response.json()
        setTrainer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "Trainer profile could not be loaded"}</p>
          <a
            href="/marketplace/personal-trainer-website"
            className="inline-flex items-center px-4 py-2 bg-[#D2FF28] text-black rounded-lg hover:bg-[#D2FF28]/90"
          >
            Create Your Profile
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-[#D2FF28] rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-black">
                {trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{trainer.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{trainer.location}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#D2FF28] text-[#D2FF28]" />
                  <span>{trainer.rating}</span>
                  <span className="text-gray-300">({trainer.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{trainer.experience}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {trainer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#D2FF28] text-black">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <p className="text-gray-600 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trainer.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-5 h-5 text-[#D2FF28]" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Availability
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {trainer.availability.map((time, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                      {time}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Pricing</h2>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-[#D2FF28] rounded-lg">
                    <div className="text-2xl font-bold text-black">{trainer.pricing.sessionRate}</div>
                    <div className="text-sm text-black/70">per session</div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Package Deals:</h3>
                    {trainer.pricing.packageDeals.map((deal, index) => (
                      <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {deal}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact</h2>
                <div className="space-y-3">
                  {trainer.contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{trainer.contact.phone}</span>
                    </div>
                  )}
                  {trainer.contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{trainer.contact.email}</span>
                    </div>
                  )}
                  {trainer.contact.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={trainer.contact.website} className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {trainer.contact.social && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Follow Me</h3>
                    <div className="flex gap-3">
                      {trainer.contact.social.instagram && (
                        <a
                          href={trainer.contact.social.instagram}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {trainer.contact.social.facebook && (
                        <a
                          href={trainer.contact.social.facebook}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {trainer.contact.social.twitter && (
                        <a
                          href={trainer.contact.social.twitter}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <Button className="w-full mt-6 bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">Book a Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
