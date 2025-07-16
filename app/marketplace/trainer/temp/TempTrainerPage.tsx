"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star, Mail, Phone, Edit } from "lucide-react"

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrainerData()
  }, [tempId])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/temp/${tempId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch trainer data")
      }

      const data = await response.json()
      setTrainer(data.trainer)
    } catch (error) {
      console.error("Error fetching trainer:", error)
      setError("Failed to load trainer profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold mb-2">AI is generating your website...</h2>
          <p className="text-gray-600 mb-4">Creating a personalized trainer website based on your profile</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This usually takes 2-3 seconds</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The trainer profile could not be loaded."}</p>
          <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Trial expires in: 23h 59m 41s</span>
              </div>
              <Badge variant="secondary">Preview Mode</Badge>
            </div>
            <Button className="bg-lime-400 hover:bg-lime-500 text-black font-semibold">Activate Website - €70</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 break-words">
            Transform Your Fitness with {trainer.name}
          </h1>
          <p className="text-xl mb-6 break-words">
            Professional {trainer.specialization} trainer in {trainer.location}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="h-3 w-3 mr-1" />
              {trainer.experience} Experience
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <MapPin className="h-3 w-3 mr-1" />
              {trainer.location}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              {trainer.specialization}
            </Badge>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Book Free Consultation
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">👤</span>
                  </div>
                  About {trainer.name}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/trainer/${tempId}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                    {trainer.bio ||
                      `I'm ${trainer.name}, a passionate fitness professional with ${trainer.experience} of experience in ${trainer.specialization}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.

My approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.

I'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Personal Training</h3>
                      <Badge>Featured</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 break-words">
                      One-on-one personalized training session focused on your specific goals
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">€60</span>
                      <span className="text-sm text-gray-500">60 minutes</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Fitness Assessment</h3>
                    <p className="text-gray-600 text-sm mb-3 break-words">
                      Comprehensive fitness evaluation and goal-setting session
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">€40</span>
                      <span className="text-sm text-gray-500">45 minutes</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg md:col-span-2">
                    <h3 className="font-semibold mb-2">Custom Workout Plan</h3>
                    <p className="text-gray-600 text-sm mb-3 break-words">
                      Personalized workout program designed for your goals and schedule
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">€80</span>
                      <span className="text-sm text-gray-500">Digital delivery</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <span className="text-sm break-all">{trainer.email}</span>
                </div>
                {trainer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm break-words">{trainer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm break-words">{trainer.location}</span>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Availability</h4>
                  <p className="text-sm text-gray-600 break-words">
                    Monday - Friday: 6AM - 8PM
                    <br />
                    Saturday: 8AM - 4PM
                  </p>
                </div>

                <Button className="w-full mt-4">Book Consultation</Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/marketplace/trainer/${tempId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Website
                </Button>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    "Working with {trainer.name} has been life-changing. Their expertise in {trainer.specialization}{" "}
                    helped me achieve results I never thought possible."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Sarah M.</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    "Professional, knowledgeable, and motivating. {trainer.name} creates personalized programs that
                    actually work."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Mike R.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
