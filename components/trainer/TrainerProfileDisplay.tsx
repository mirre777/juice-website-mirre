"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Clock, Award, MessageCircle, Calendar, Edit, Eye, AlertCircle, CheckCircle } from "lucide-react"
import type { DisplayTrainerData } from "@/types/trainer"

interface TrainerProfileDisplayProps {
  trainer: DisplayTrainerData
  mode: "live" | "temp"
  isEditable?: boolean
  timeLeft?: number
  onEdit?: () => void
  onActivate?: () => void
  onBookConsultation?: () => void
  onSendMessage?: () => void
}

export function TrainerProfileDisplay({
  trainer,
  mode,
  isEditable = false,
  timeLeft,
  onEdit,
  onActivate,
  onBookConsultation,
  onSendMessage,
}: TrainerProfileDisplayProps) {
  const [activeSection, setActiveSection] = useState<"about" | "services" | "contact">("about")

  // Format time for temp mode countdown
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Mode-specific banner */}
      {mode === "temp" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Preview Mode</span>
                {timeLeft && (
                  <>
                    <span className="text-blue-600">•</span>
                    <span className="text-blue-700">{formatTime(timeLeft)} remaining</span>
                  </>
                )}
              </div>
              {onActivate && (
                <Button onClick={onActivate} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Activate Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div
          className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative"
          style={{
            backgroundImage: trainer.coverImage ? `url(${trainer.coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end space-x-4">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={trainer.avatar || "/placeholder.svg"} alt={trainer.name} />
                <AvatarFallback className="text-2xl">
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-1">{trainer.name}</h1>
                <p className="text-xl text-blue-100 mb-2">{trainer.title}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{trainer.location.full}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{trainer.rating}</span>
                    <span className="text-blue-200">({trainer.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              {mode === "live" && isEditable && onEdit && (
                <Button onClick={onEdit} variant="secondary" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex space-x-1">
                {(["about", "services", "contact"] as const).map((section) => (
                  <Button
                    key={section}
                    variant={activeSection === section ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSection(section)}
                    className="capitalize"
                  >
                    {section}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {/* About Section */}
              {activeSection === "about" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{trainer.content.about.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{trainer.content.about.content}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Highlights</h4>
                    <ul className="space-y-1">
                      {trainer.content.about.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeSection === "services" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Services & Pricing</h3>
                  <div className="grid gap-4">
                    {trainer.services.map((service, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{service.name}</h4>
                          <span className="font-semibold text-blue-600">{service.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === "contact" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{trainer.content.contact.title}</h3>
                    <p className="text-gray-600 mb-4">{trainer.content.contact.subtitle}</p>
                  </div>
                  <div className="flex space-x-3">
                    {mode === "live" ? (
                      <>
                        {onBookConsultation && (
                          <Button onClick={onBookConsultation} className="flex-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            {trainer.content.contact.cta}
                          </Button>
                        )}
                        {onSendMessage && (
                          <Button onClick={onSendMessage} variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button onClick={onActivate} className="flex-1" disabled={!onActivate}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Activate to Contact
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Quick Info</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{trainer.experience} experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{trainer.certifications.join(", ")}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Availability: </span>
                <span className="text-sm text-green-600">{trainer.availability}</span>
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Specialties</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Pricing</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Consultation</span>
                <span className="font-medium">{trainer.pricing.consultation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Single Session</span>
                <span className="font-medium">{trainer.pricing.session}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Monthly Package</span>
                <span className="font-medium">{trainer.pricing.package}</span>
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          {mode === "temp" && onActivate && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold text-blue-900 mb-2">Ready to Go Live?</h4>
                <p className="text-sm text-blue-700 mb-3">Activate your profile to start accepting clients</p>
                <Button onClick={onActivate} className="w-full bg-blue-600 hover:bg-blue-700">
                  Activate for €30
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
