"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Navbar from "@/components/navbar"
import type { TrainerFormData } from "@/types/trainer"
import { logger } from "@/lib/logger"

const services = [
  "Personal Training",
  "Group Fitness",
  "Nutrition Coaching",
  "Weight Loss Programs",
  "Strength Training",
  "Cardio Training",
  "Flexibility & Mobility",
  "Sports-Specific Training",
  "Rehabilitation",
  "Online Coaching",
]

const specialties = [
  "Personal Training",
  "Strength & Conditioning",
  "Weight Loss Specialist",
  "Nutrition Coach",
  "Yoga Instructor",
  "Pilates Instructor",
  "CrossFit Coach",
  "Sports Performance",
  "Rehabilitation Specialist",
  "Group Fitness Instructor",
]

const experienceLevels = ["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"]

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<TrainerFormData>({
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
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof TrainerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Log form interaction for analytics
    logger.debug("Form field updated", {
      field,
      hasValue: !!value,
      valueLength: value.length,
      timestamp: new Date().toISOString(),
    })
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...(prev.services || []), service],
    }))

    logger.debug("Service selection changed", {
      service,
      action: formData.services?.includes(service) ? "removed" : "added",
      totalServices: formData.services?.length || 0,
    })
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.fullName || formData.fullName.length < 2) {
      errors.fullName = "Name must be at least 2 characters"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.location || formData.location.length < 5) {
      errors.location = "Location must be at least 5 characters"
    }

    if (!formData.specialty) {
      errors.specialty = "Please select your specialty"
    }

    if (!formData.experience) {
      errors.experience = "Please select your experience level"
    }

    if (!formData.bio || formData.bio.length < 50) {
      errors.bio = "Bio must be at least 50 characters"
    } else if (formData.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters"
    }

    if (!formData.services || formData.services.length === 0) {
      errors.services = "Please select at least one service"
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      logger.warn("Form validation failed", {
        errors: Object.keys(errors),
        email: formData.email,
        specialty: formData.specialty,
      })
    }

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    logger.info("Form submission started", {
      email: formData.email,
      specialty: formData.specialty,
      location: formData.location,
      servicesCount: formData.services?.length || 0,
      hasPhone: !!formData.phone,
      hasCertifications: !!formData.certifications,
      bioLength: formData.bio.length,
    })

    if (!validateForm()) {
      logger.warn("Form submission blocked by validation", {
        email: formData.email,
        validationErrors: Object.keys(validationErrors),
      })
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      logger.info("Sending trainer creation request", {
        email: formData.email,
        specialty: formData.specialty,
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
        logger.info("Trainer creation successful, redirecting", {
          email: formData.email,
          tempId: result.tempId,
          redirectUrl: result.redirectUrl,
        })

        // Redirect to temp page
        window.location.href = result.redirectUrl
      } else {
        logger.error("Trainer creation failed", {
          email: formData.email,
          error: result.error,
          details: result.details,
        })

        if (result.details && Array.isArray(result.details)) {
          // Handle Zod validation errors
          const fieldErrors: Record<string, string> = {}
          result.details.forEach((detail: any) => {
            if (detail.path && detail.path.length > 0) {
              fieldErrors[detail.path[0]] = detail.message
            }
          })
          setValidationErrors(fieldErrors)
        } else {
          setError(result.error || "Failed to create trainer profile")
        }
      }
    } catch (err) {
      logger.error("Network error during trainer creation", {
        email: formData.email,
        error: err,
      })
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.location &&
      formData.specialty &&
      formData.experience &&
      formData.bio &&
      formData.services &&
      formData.services.length > 0
    )
  }

  const getCharacterCount = (text: string, max: number) => {
    const remaining = max - text.length
    const isNearLimit = remaining <= 50
    const isOverLimit = remaining < 0

    return (
      <span className={`text-sm ${isOverLimit ? "text-red-500" : isNearLimit ? "text-yellow-600" : "text-gray-500"}`}>
        {text.length}/{max} characters
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#D2FF28] rounded-full">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <Badge className="bg-[#D2FF28] text-black px-4 py-2 text-lg font-medium">Super fast</Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get Your Professional{" "}
              <span className="text-black relative">
                Trainer Website
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#D2FF28] opacity-80 rounded"></div>
              </span>{" "}
              in Minutes
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
              Juice creates a stunning, professional website tailored to your training expertise. No coding required -
              just fill out the form and watch your online presence come to life.
            </p>

            <div className="flex items-center gap-8 mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Superfast design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Ready in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Professional Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-[#D2FF28] rounded-full">
                  <Users className="w-8 h-8 text-black" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Trainers Trust Us</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-[#D2FF28] rounded-full">
                  <TrendingUp className="w-8 h-8 text-black" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-[#D2FF28] rounded-full">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Website Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Create Your Trainer Profile</h2>
            <p className="text-xl text-gray-600">
              Fill out this form and our AI will generate your professional website instantly
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-2xl text-center">Trainer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-base font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Smith"
                      className={`mt-2 h-12 ${validationErrors.fullName ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className={`mt-2 h-12 ${validationErrors.email ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2 h-12"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-base font-medium">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="New York, NY"
                      className={`mt-2 h-12 ${validationErrors.location ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.location && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="specialty" className="text-base font-medium">
                      Primary Specialty *
                    </Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) => handleInputChange("specialty", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={`mt-2 h-12 ${validationErrors.specialty ? "border-red-500" : ""}`}>
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
                    {validationErrors.specialty && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.specialty}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-base font-medium">
                      Experience Level *
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={`mt-2 h-12 ${validationErrors.experience ? "border-red-500" : ""}`}>
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
                    {validationErrors.experience && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.experience}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-base font-medium">
                    Professional Bio *
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 mb-2">
                    Tell potential clients about your background, training philosophy, and what makes you unique.
                  </p>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="I'm a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals. My approach focuses on sustainable lifestyle changes and personalized workout plans that fit your schedule and preferences..."
                    className={`mt-2 min-h-32 ${validationErrors.bio ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {validationErrors.bio && <p className="text-red-500 text-sm">{validationErrors.bio}</p>}
                    <div className="ml-auto">{getCharacterCount(formData.bio, 500)}</div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <Label htmlFor="certifications" className="text-base font-medium">
                    Certifications & Qualifications
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 mb-2">
                    List your certifications, degrees, or other qualifications (comma-separated).
                  </p>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                    placeholder="NASM-CPT, ACE Personal Trainer, Nutrition Specialist"
                    className="mt-2 h-12"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Services */}
                <div>
                  <Label className="text-base font-medium">Services Offered *</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-4">Select all services you provide to your clients.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <div key={service} className="flex items-center space-x-3">
                        <Checkbox
                          id={service}
                          checked={formData.services?.includes(service) || false}
                          onCheckedChange={() => handleServiceToggle(service)}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor={service} className="text-sm font-medium cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {validationErrors.services && (
                    <p className="text-red-500 text-sm mt-2">{validationErrors.services}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-[#D2FF28] hover:bg-[#B8E625] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Your Website...
                      </>
                    ) : (
                      <>
                        Generate My Website
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Your website will be generated instantly. You'll have 24 hours to review and activate it for €70.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
