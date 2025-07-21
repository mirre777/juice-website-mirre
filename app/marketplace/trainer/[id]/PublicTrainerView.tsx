"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Star, X } from "lucide-react"
import type { TrainerProfile, TrainerContent } from "@/types/trainer"

interface PublicTrainerViewProps {
  trainer: TrainerProfile
  content: TrainerContent
  onExitLiveView: () => void
}

export default function PublicTrainerView({ trainer, content, onExitLiveView }: PublicTrainerViewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Floating Exit Button */}
      <Button
        onClick={onExitLiveView}
        className="fixed top-4 right-4 z-50 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
        size="sm"
      >
        <X className="h-4 w-4 mr-2" />
        Exit Live View
      </Button>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-100">{content.hero.subtitle}</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-50">{content.hero.description}</p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {trainer.experience} Experience
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              {trainer.location}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {trainer.specialization}
            </Badge>
          </div>

          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
            Book Free Consultation
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{content.about.title}</h2>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700">
                  {content.about.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {trainer.certifications && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Certifications</h3>
                    <p className="text-gray-700">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Services & Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.services.map((service) => (
                  <Card key={service.id} className={`relative ${service.featured ? "ring-2 ring-blue-500" : ""}`}>
                    {service.featured && <Badge className="absolute -top-2 left-4 bg-blue-500">Most Popular</Badge>}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">€{service.price}</span>
                          <span className="text-gray-500 ml-1">/ {service.duration}</span>
                        </div>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{content.contact.title}</h2>
                <p className="text-gray-600 mb-6">{content.contact.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <a href={`mailto:${content.contact.email}`} className="text-blue-600 hover:underline">
                      {content.contact.email}
                    </a>
                  </div>

                  {content.contact.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-3" />
                      <a href={`tel:${content.contact.phone}`} className="text-blue-600 hover:underline">
                        {content.contact.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{content.contact.location}</span>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg">
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
