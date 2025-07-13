"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Globe, Smartphone, Zap, Star } from "lucide-react"

interface FormData {
  fullName: string
  email: string
  phone: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications: string
  services: string[]
  pricing: string
  socialMedia: {
    instagram: string
    facebook: string
    website: string
  }
}

interface FormErrors {
  [key: string]: string
}

const specialties = [
  "Weight Loss",
  "Strength Training",
  "Cardio Fitness",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Bodybuilding",
  "Sports Performance",
  "Rehabilitation",
  "Nutrition Coaching",
  "Senior Fitness",
  "Youth Training",
]

const services = [
  "One-on-One Training",
  "Group Classes",
  "Online Coaching",
  "Nutrition Planning",
  "Workout Plans",
  "Progress Tracking",
  "Injury Prevention",
  "Competition Prep",
  "Lifestyle Coaching",
  "Virtual Sessions",
]

const experienceLevels = ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"]

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialty: "",
    experience: "",
    bio: "",
    certifications: "",
    services: [],
    pricing: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      website: "",
    },
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    } else if (formData.location.trim().length < 5) {
      newErrors.location = "Please enter a more specific location"
    }

    if (!formData.specialty) {
      newErrors.specialty = "Please select a specialty"
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your experience level"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required"
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = "Bio must be at least 50 characters long"
    }

    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))

    // Clear services error when user selects a service
    if (errors.services) {
      setErrors((prev) => ({
        ...prev,
        services: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

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
        setIsSuccess(true)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || "Something went wrong. Please try again." })
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">
              Your trainer profile has been created successfully. We'll review your information and get back to you
              within 24 hours.
            </p>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your Professional Trainer Website</h1>
          <p className="text-xl mb-8">Get a stunning, mobile-optimized website in minutes</p>
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
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
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="New York, NY"
                          className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specialization</h3>
                    <div>
                      <Label htmlFor="specialty">Primary Specialty *</Label>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) => handleInputChange("specialty", value)}
                      >
                        <SelectTrigger className={errors.specialty ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.specialty && <p className="text-red-600 text-sm mt-1">{errors.specialty}</p>}
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Select
                          value={formData.experience}
                          onValueChange={(value) => handleInputChange("experience", value)}
                        >
                          <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
                      </div>
                      <div>
                        <Label htmlFor="bio">Professional Bio *</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about your training philosophy, experience, and what makes you unique..."
                          rows={4}
                          className={errors.bio ? "border-red-500" : ""}
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters (minimum 50)</p>
                        {errors.bio && <p className="text-red-600 text-sm mt-1">{errors.bio}</p>}
                      </div>
                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Input
                          id="certifications"
                          value={formData.certifications}
                          onChange={(e) => handleInputChange("certifications", e.target.value)}
                          placeholder="NASM, ACE, ACSM, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Services Offered *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={formData.services.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service} className="text-sm font-normal">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.services && <p className="text-red-600 text-sm mt-2">{errors.services}</p>}
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                    <div>
                      <Label htmlFor="pricing">Starting Price (per session)</Label>
                      <Input
                        id="pricing"
                        value={formData.pricing}
                        onChange={(e) => handleInputChange("pricing", e.target.value)}
                        placeholder="$75"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media & Website</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                          placeholder="@yourhandle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                          placeholder="facebook.com/yourpage"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Current Website</Label>
                        <Input
                          id="website"
                          value={formData.socialMedia.website}
                          onChange={(e) => handleSocialMediaChange("website", e.target.value)}
                          placeholder="www.yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    {errors.submit && <p className="text-red-600 text-sm mb-4">{errors.submit}</p>}
                    <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-lg">
                      {isSubmitting ? "Creating Your Website..." : "Create My Website"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
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
                    <h4 className="font-semibold">Social Media Integration</h4>
                    <p className="text-sm text-gray-600">Connect your social media profiles and grow your following</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">SEO Optimized</h4>
                    <p className="text-sm text-gray-600">Get found by local clients searching for trainers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
