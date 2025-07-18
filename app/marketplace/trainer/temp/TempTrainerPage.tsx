"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, Mail, Star, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
  }
  services: Service[]
  contact: {
    title: string
    description: string
    email: string
    phone: string
    location: string
  }
  seo: {
    title: string
    description: string
  }
}

interface Trainer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  certifications: string
  experience: string
  specialization: string
  expiresAt: string
  isActive: boolean
  content?: TrainerContent
}

interface TempTrainerPageProps {
  trainer: Trainer
  token?: string
}

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!expiresAt) return

    const updateCountdown = () => {
      try {
        const now = new Date().getTime()
        const expiration = new Date(expiresAt).getTime()
        const difference = expiration - now

        if (difference <= 0) {
          setTimeLeft("Expired")
          setIsExpired(true)
          return
        }

        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        setIsExpired(false)
      } catch (error) {
        console.error("Countdown error:", error)
        setTimeLeft("Invalid date")
        setIsExpired(true)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return { timeLeft, isExpired }
}

export default function TempTrainerPage({ trainer, token }: TempTrainerPageProps) {
  const { timeLeft, isExpired } = useCountdown(trainer.expiresAt)

  const handleActivate = () => {
    console.log("=== ACTIVATE BUTTON CLICKED ===")
    console.log("Trainer ID:", trainer?.id)
    console.log("Has token:", !!token)
    console.log("Token value:", token?.substring(0, 10) + "...")

    if (!trainer?.id) {
      console.error("No trainer ID available")
      alert("Error: No trainer ID available")
      return
    }

    if (!token) {
      console.error("No token available")
      alert("Error: No access token available")
      return
    }

    const paymentUrl = `/payment?tempId=${trainer.id}&token=${encodeURIComponent(token)}`
    console.log("Redirecting to:", paymentUrl)

    window.location.href = paymentUrl
  }

  const handleBookConsultation = () => {
    console.log("Book consultation clicked")
    alert("This is a preview. Activate your website to enable booking functionality!")
  }

  const handleContactNow = () => {
    console.log("Contact now clicked")
    alert("This is a preview. Activate your website to enable contact functionality!")
  }

  const handleGetStarted = () => {
    console.log("Get started clicked")
    alert("This is a preview. Activate your website to enable this functionality!")
  }

  const content = trainer.content || {
    hero: {
      title: `Transform Your Fitness with ${trainer.name}`,
      subtitle: `Professional ${trainer.specialization} trainer in ${trainer.location}`,
      description:
        trainer.bio ||
        "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
    },
    about: {
      title: `About ${trainer.name}`,
      content:
        trainer.bio || "Passionate fitness professional with years of experience helping clients achieve their goals.",
    },
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session focused on your specific goals",
        price: 60,
        duration: "60 minutes",
        featured: true,
      },
      {
        id: "2",
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation and goal-setting session",
        price: 40,
        duration: "45 minutes",
        featured: false,
      },
      {
        id: "3",
        title: "Custom Workout Plan",
        description: "Personalized workout program designed for your goals and schedule",
        price: 80,
        duration: "Digital delivery",
        featured: false,
      },
    ],
    contact: {
      title: "Let's Start Your Fitness Journey",
      description: "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
      email: trainer.email,
      phone: trainer.phone || "",
      location: trainer.location,
    },
    seo: {
      title: `${trainer.name} - Personal Trainer in ${trainer.location}`,
      description: `Professional ${trainer.specialization} training with ${trainer.name}. Transform your fitness with personalized programs in ${trainer.location}.`,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Trial expires in: {timeLeft}</span>
            <Badge variant="secondary">Preview Mode</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/marketplace/trainer/${trainer.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button className="bg-lime-500 hover:bg-lime-600 text-black" onClick={handleActivate} disabled={isExpired}>
              {isExpired ? "Trial Expired" : "Activate Website - €70"}
            </Button>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 break-words">{content.hero.title}</h1>
          <p className="text-xl mb-6 text-blue-100 break-words">{content.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-4 w-4 mr-1" />
              {trainer.experience} Experience
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <MapPin className="h-4 w-4 mr-1" />
              {trainer.location}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-4 w-4 mr-1" />
              {trainer.specialization}
            </Badge>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleBookConsultation}>
            Book Free Consultation
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold">{content.about.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed break-words overflow-wrap-anywhere">
                    {content.about.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Services</h2>
                <div className="grid gap-4">
                  {content.services.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold break-words">{service.title}</h3>
                          {service.featured && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold">€{service.price}</div>
                          <div className="text-sm text-gray-500 break-words">{service.duration}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm break-words overflow-wrap-anywhere">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm break-all">{content.contact.email}</span>
                  </div>
                  {content.contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm break-words">{content.contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm break-words">{content.contact.location}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={handleContactNow}>
                  Contact Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold mb-2">{content.contact.title}</h3>
                <p className="text-sm text-gray-600 mb-4 break-words overflow-wrap-anywhere">
                  {content.contact.description}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleGetStarted}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
