"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, User, Phone, Mail, Edit } from "lucide-react"

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  specialty: string
  experience: string
  expiresAt: string
  content: {
    about: { title: string; content: string }
    hero: { title: string; subtitle: string; description: string }
    contact: { title: string; description: string; email: string; phone: string; location: string }
    services: Array<{
      id: string
      title: string
      description: string
      price: number
      duration: string
      featured: boolean
    }>
    seo: { title: string; description: string }
  }
}

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("Expired")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  return timeLeft
}

export default function TempTrainerPage({
  tempId,
  token,
  initialData,
}: {
  tempId: string
  token: string
  initialData: TrainerData
}) {
  const [trainerData, setTrainerData] = useState<TrainerData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const timeLeft = useCountdown(trainerData.expiresAt)

  const handleEdit = () => {
    window.location.href = `/marketplace/trainer/${tempId}/edit?token=${token}`
  }

  const handleActivate = () => {
    window.location.href = `/payment?tempId=${tempId}&token=${token}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖✨</div>
          <h2 className="text-2xl font-bold mb-2">AI is generating your website...</h2>
          <p className="text-gray-600 mb-4">Creating a personalized trainer website based on your profile</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
          </div>
          <p className="text-sm text-gray-500">This usually takes 2-3 seconds</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Trial expires in: {timeLeft}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Preview Mode</Badge>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button onClick={handleActivate} size="sm" className="bg-lime-500 hover:bg-lime-600">
              Activate Website - €70
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{trainerData.content.hero.title}</h1>
          <p className="text-xl mb-2 text-blue-100">{trainerData.content.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <User className="h-3 w-3 mr-1" />
              {trainerData.experience} Experience
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <MapPin className="h-3 w-3 mr-1" />
              {trainerData.location}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              {trainerData.specialty}
            </Badge>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Book Free Consultation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {trainerData.content.about.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                  {trainerData.content.about.content}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            {trainerData.content.services.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {trainerData.content.services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.title}</h3>
                          <div className="text-right">
                            <div className="font-bold">€{service.price}</div>
                            <div className="text-sm text-gray-500">{service.duration}</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm break-words">{service.description}</p>
                        {service.featured && (
                          <Badge className="mt-2" variant="secondary">
                            Featured
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm break-all">{trainerData.content.contact.email}</span>
                </div>
                {trainerData.content.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm break-words">{trainerData.content.contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm break-words">{trainerData.content.contact.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
