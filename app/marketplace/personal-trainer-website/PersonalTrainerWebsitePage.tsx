"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Star, Users, Calendar, DollarSign, Globe, Smartphone, Zap } from "lucide-react"
import { toast } from "sonner"
import { logger } from "@/lib/logger"

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
  "Senior Fitness",
  "Youth Training",
  "Nutrition Coaching",
]

const experienceLevels = ["Less than 1 year", "1-2 years", "3-5 years", "5+ years", "10+ years"]

const serviceOptions = [
  "Personal Training",
  "Group Classes",
  "Online Coaching",
  "Nutrition Coaching",
  "Meal Planning",
  "Fitness Assessments",
  "Workout Plans",
  "Progress Tracking",
]

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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.specialty) newErrors.specialty = "Please select a specialty"
    if (!formData.experience) newErrors.experience = "Please select experience level"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters"
    if (formData.services.length === 0) newErrors.services = "Please select at least one service"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    try {
      logger.info("Submitting trainer form", {
        email: formData.email,
        specialty: formData.specialty,
        servicesCount: formData.services.length,
      })

      const response = await fetch("/api/trainer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        logger.info("Trainer form submitted successfully", {
          tempId: result.tempId,
          email: formData.email,
        })

        toast.success("Profile created successfully! Redirecting to your temporary profile...")

        // Redirect to temporary profile page
        setTimeout(() => {
          window.location.href = result.redirectUrl
        }, 1500)
      } else {
        logger.error("Trainer form submission failed", {
          error: result.error,
          details: result.details,
          email: formData.email,
        })

        toast.error(result.error || "Failed to create profile. Please try again.")

        if (result.details) {
          // Handle validation errors
          const newErrors: Record<string, string> = {}
          result.details.forEach((detail: any) => {
            if (detail.path && detail.path.length > 0) {
              newErrors[detail.path[0]] = detail.message
            }
          })
          setErrors(newErrors)
        }
      }
    } catch (error) {
      logger.error("Trainer form submission error", {
        error: error instanceof Error ? error.message : String(error),
        email: formData.email,
      })

      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Personal Trainer Website</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of fitness professionals who have built their online presence with our platform. Get your
            professional website in minutes, not weeks.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Professional Website</h3>
              <p className="text-gray-600">Get a stunning, mobile-responsive website that showcases your expertise</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
              <p className="text-gray-600">Launch your website in under 10 minutes with our simple form</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">Your website looks perfect on all devices and screen sizes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Profile</CardTitle>
              <CardDescription>Fill out the form below to get started with your trainer website</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
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
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
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
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Los Angeles, CA"
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Specialty *</Label>
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
                      {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience Level *</Label>
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
                      {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell potential clients about your background, training philosophy, and what makes you unique..."
                      rows={4}
                      className={errors.bio ? "border-red-500" : ""}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                      <p className="text-gray-500 text-sm ml-auto">{formData.bio.length}/500 characters</p>
                    </div>
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

                <Separator />

                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Services Offered *</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
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
                  {errors.services && <p className="text-red-500 text-sm">{errors.services}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Your Website..." : "Create My Trainer Website"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">What You'll Get</CardTitle>
                <CardDescription>Your professional trainer website will include all these features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Professional Profile Page</h4>
                    <p className="text-gray-600 text-sm">Showcase your expertise, certifications, and services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Contact Form</h4>
                    <p className="text-gray-600 text-sm">Let potential clients reach out to you directly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Mobile Responsive Design</h4>
                    <p className="text-gray-600 text-sm">Looks great on all devices and screen sizes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">SEO Optimized</h4>
                    <p className="text-gray-600 text-sm">Help potential clients find you online</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Easy Content Management</h4>
                    <p className="text-gray-600 text-sm">Update your profile and content anytime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-xl border-2 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-600">Launch Special</CardTitle>
                <CardDescription>Limited time offer for new trainers</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Professional website</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Unlimited client inquiries</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>Booking integration</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span>Payment processing</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  7-day free trial included
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
