"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Globe, Smartphone, Zap } from "lucide-react"

interface FormData {
  fullName: string
  email: string
  phone: string
  location: string
  specializations: string[]
  bio: string
  experience: string
  certifications: string
  services: string
  pricing: string
  availability: string
  socialMedia: {
    instagram: string
    facebook: string
    website: string
  }
}

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specializations: [],
    bio: "",
    experience: "",
    certifications: "",
    services: "",
    pricing: "",
    availability: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      website: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSpecializationToggle = (specialization: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const specializationOptions = [
    "Weight Loss",
    "Muscle Building",
    "Strength Training",
    "Cardio",
    "Yoga",
    "Pilates",
    "CrossFit",
    "Sports Performance",
    "Rehabilitation",
    "Senior Fitness",
    "Youth Training",
    "Nutrition Coaching",
  ]

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Created!</h2>
            <p className="text-gray-600 mb-6">
              Your professional trainer website is being set up. You'll receive an email with your website link and
              login details within 24 hours.
            </p>
            <Button onClick={() => setIsSuccess(false)} className="w-full">
              Create Another Website
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your Professional Trainer Website</h1>
          <p className="text-xl mb-8 opacity-90">Get a stunning, mobile-optimized website in minutes</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tell Us About Yourself</CardTitle>
                <CardDescription>Fill out this form to create your professional trainer website</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(555) 123-4567"
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

                  {/* Specializations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specializations</h3>
                    <p className="text-sm text-gray-600 mb-4">Select all that apply:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specializationOptions.map((spec) => (
                        <Badge
                          key={spec}
                          variant={formData.specializations.includes(spec) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2"
                          onClick={() => handleSpecializationToggle(spec)}
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bio">Professional Bio *</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell potential clients about your background, training philosophy, and what makes you unique..."
                          rows={4}
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
                          placeholder="NASM-CPT, ACSM, etc."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Services & Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Services & Pricing</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="services">Services Offered *</Label>
                        <Textarea
                          id="services"
                          value={formData.services}
                          onChange={(e) => handleInputChange("services", e.target.value)}
                          placeholder="Personal training sessions, group classes, online coaching, nutrition planning..."
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing">Pricing Information</Label>
                        <Textarea
                          id="pricing"
                          value={formData.pricing}
                          onChange={(e) => handleInputChange("pricing", e.target.value)}
                          placeholder="1-on-1 sessions: $75/hour, Group sessions: $30/person, etc."
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
                  </div>

                  <Separator />

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media & Website</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => handleInputChange("socialMedia.instagram", e.target.value)}
                          placeholder="@yourhandle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => handleInputChange("socialMedia.facebook", e.target.value)}
                          placeholder="facebook.com/yourpage"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Existing Website</Label>
                        <Input
                          id="website"
                          value={formData.socialMedia.website}
                          onChange={(e) => handleInputChange("socialMedia.website", e.target.value)}
                          placeholder="www.yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Your Website..." : "Create My Website"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Professional Website</h4>
                    <p className="text-sm text-gray-600">
                      A beautiful, mobile-responsive website showcasing your services
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Client Booking System</h4>
                    <p className="text-sm text-gray-600">Let clients book sessions directly through your website</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Contact Forms</h4>
                    <p className="text-sm text-gray-600">Capture leads and inquiries from potential clients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">SEO Optimized</h4>
                    <p className="text-sm text-gray-600">Help potential clients find you on Google</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Social Media Integration</h4>
                    <p className="text-sm text-gray-600">Connect your social profiles and grow your following</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-semibold text-blue-900 mb-2">Launch Special</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Get your professional trainer website for just <span className="font-bold">$49/month</span>
                  </p>
                  <p className="text-xs text-blue-600">Includes hosting, maintenance, and updates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
