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
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Globe, Smartphone, Zap, User, Star, Clock } from "lucide-react"

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
  availability: string
  socialMedia: {
    instagram: string
    facebook: string
    website: string
  }
}

const specialties = [
  "Personal Training",
  "Weight Loss",
  "Strength & Conditioning",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Nutrition Coaching",
  "Sports Performance",
  "Rehabilitation",
  "Group Fitness",
]

const services = [
  "One-on-One Training",
  "Group Sessions",
  "Online Coaching",
  "Nutrition Planning",
  "Workout Programs",
  "Progress Tracking",
  "Lifestyle Coaching",
  "Competition Prep",
]

const experienceLevels = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"]

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
    availability: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      website: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (formData.location.length < 5) newErrors.location = "Location must be at least 5 characters"
    if (!formData.specialty) newErrors.specialty = "Please select a specialty"
    if (!formData.experience) newErrors.experience = "Please select experience level"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters"
    if (formData.services.length === 0) newErrors.services = "Please select at least one service"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSocialMediaChange = (platform: keyof FormData["socialMedia"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }))
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

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        console.log("Trainer created successfully:", result)
      } else {
        console.error("Form submission failed:", result.error)
        setErrors({ submit: result.error || "Failed to create trainer profile" })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">
              Your trainer profile has been created successfully. You'll receive an email with next steps.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Create Another Profile
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
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Professional Design
            </div>
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Mobile Optimized
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Setup
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Tell Us About Yourself
                </CardTitle>
                <CardDescription>Fill out this form to create your professional trainer website</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Smith"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="New York, NY"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specialization</h3>
                    <div>
                      <Label>Primary Specialty *</Label>
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
                    <div className="mt-4">
                      <Label>Experience Level *</Label>
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

                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
                    <div>
                      <Label htmlFor="bio">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell potential clients about your background, training philosophy, and what makes you unique..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        className={`min-h-[120px] ${errors.bio ? "border-red-500" : ""}`}
                      />
                      <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters (minimum 50)</p>
                      {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Textarea
                        id="certifications"
                        placeholder="List your certifications (e.g., NASM-CPT, ACE, ACSM...)"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Services & Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Services & Pricing</h3>
                    <div>
                      <Label>Services Offered *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {services.map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.services.includes(service)}
                              onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <Label htmlFor={service} className="text-sm">
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pricing">Starting Price</Label>
                        <Input
                          id="pricing"
                          placeholder="$75/session"
                          value={formData.pricing}
                          onChange={(e) => handleInputChange("pricing", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Input
                          id="availability"
                          placeholder="Mon-Fri 6AM-8PM"
                          value={formData.availability}
                          onChange={(e) => handleInputChange("availability", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media & Website</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          placeholder="@yourhandle"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          placeholder="facebook.com/yourpage"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="yourwebsite.com"
                          value={formData.socialMedia.website}
                          onChange={(e) => handleSocialMediaChange("website", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Your Website...
                      </>
                    ) : (
                      "Create My Trainer Website"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Professional Website</h4>
                    <p className="text-sm text-gray-600">
                      A beautiful, mobile-responsive website showcasing your services
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Client Booking System</h4>
                    <p className="text-sm text-gray-600">Let clients book sessions directly through your website</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Contact Forms</h4>
                    <p className="text-sm text-gray-600">Capture leads and inquiries from potential clients</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Social Media Integration</h4>
                    <p className="text-sm text-gray-600">Connect your social profiles to grow your following</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Quick & Easy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Fill out form</span>
                    <Badge variant="secondary">2 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Website generation</span>
                    <Badge variant="secondary">30 sec</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Go live</span>
                    <Badge variant="secondary">Instant</Badge>
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
