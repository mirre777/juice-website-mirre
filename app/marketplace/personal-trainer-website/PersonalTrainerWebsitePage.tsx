"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Globe, Smartphone, Zap, Star, Users, Calendar, MessageSquare } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  specialization: string
  experience: string
  bio: string
  certifications: string
  location: string
  services: string
  pricing: string
  availability: string
  socialMedia: string
}

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    bio: "",
    certifications: "",
    location: "",
    services: "",
    pricing: "",
    availability: "",
    socialMedia: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trainer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitted(true)
        console.log("Trainer profile created:", result)
      } else {
        console.error("Failed to create trainer profile")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Success!</CardTitle>
            <CardDescription>
              Your trainer profile has been created successfully. We'll review your information and get back to you
              within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Create Your Professional Trainer Website</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Get a stunning, mobile-optimized website in minutes</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Professional Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span>Mobile Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Quick Setup</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
                <CardDescription>Fill out this form to create your professional trainer website</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>

                    <div>
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        placeholder="Weight Loss, Strength Training, Yoga"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="5 years"
                      />
                    </div>

                    <div>
                      <Label htmlFor="certifications">Certifications</Label>
                      <Textarea
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        placeholder="NASM-CPT, ACE Personal Trainer, etc."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell potential clients about your background, philosophy, and what makes you unique..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Services & Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Services & Pricing</h3>

                    <div>
                      <Label htmlFor="services">Services Offered</Label>
                      <Textarea
                        id="services"
                        value={formData.services}
                        onChange={(e) => handleInputChange("services", e.target.value)}
                        placeholder="Personal Training Sessions, Group Classes, Nutrition Coaching, etc."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pricing">Pricing Information</Label>
                      <Textarea
                        id="pricing"
                        value={formData.pricing}
                        onChange={(e) => handleInputChange("pricing", e.target.value)}
                        placeholder="1-on-1 Training: $75/session, Group Classes: $25/session, etc."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Textarea
                        id="availability"
                        value={formData.availability}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                        placeholder="Monday-Friday 6AM-8PM, Weekends by appointment"
                        rows={2}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Social Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>

                    <div>
                      <Label htmlFor="socialMedia">Social Media Links</Label>
                      <Textarea
                        id="socialMedia"
                        value={formData.socialMedia}
                        onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                        placeholder="Instagram: @yourhandle, Facebook: facebook.com/yourpage, etc."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Your Website..." : "Create My Website"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Features Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Professional Website</h4>
                    <p className="text-sm text-gray-600">
                      A beautiful, mobile-responsive website showcasing your services
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Client Booking System</h4>
                    <p className="text-sm text-gray-600">Let clients book sessions directly through your website</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact Forms</h4>
                    <p className="text-sm text-gray-600">Capture leads and inquiries from potential clients</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Social Media Integration</h4>
                    <p className="text-sm text-gray-600">Connect your social profiles to build your online presence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Client Management</h4>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Scheduling</h4>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Client Communication</h4>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Smartphone className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Mobile Optimized</h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
                <p className="mb-4 opacity-90">
                  Join hundreds of trainers who have already created their professional websites with us.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Free Setup
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    24/7 Support
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
