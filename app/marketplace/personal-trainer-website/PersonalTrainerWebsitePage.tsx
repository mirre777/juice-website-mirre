"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Star, Zap, ArrowDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormData {
  fullName: string
  email: string
  phone: string
  city: string
  district: string
  specialty: string
  bio: string
  certifications: string
  services: string[]
}

interface FormErrors {
  fullName?: string
  email?: string
  city?: string
  district?: string
  specialty?: string
  bio?: string
}

const specialties = [
  "Weight Loss",
  "Strength Training",
  "Sports Performance",
  "Rehabilitation",
  "Nutrition Coaching",
  "Group Fitness",
  "Yoga & Mindfulness",
  "Senior Fitness",
  "Youth Training",
  "Bodybuilding",
]

const serviceOptions = [
  "Personal Training",
  "Weight Loss Programs",
  "Flexibility & Mobility",
  "Online Coaching",
  "Group Fitness",
  "Strength Training",
  "Sports-Specific Training",
  "Nutrition Coaching",
  "Cardio Training",
  "Rehabilitation",
]

export default function PersonalTrainerWebsitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    specialty: "",
    bio: "",
    certifications: "",
    services: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const scrollToForm = () => {
    const formElement = document.getElementById("trainer-form")
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required"
    }

    if (!formData.specialty) {
      newErrors.specialty = "Please select your primary specialty"
    }

    // Optional bio validation - only validate if provided
    if (formData.bio.trim() && formData.bio.trim().length < 20) {
      newErrors.bio = "Bio must be at least 20 characters if provided"
    }

    if (formData.bio.trim() && formData.bio.trim().length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = (): boolean => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.district.trim() !== "" &&
      formData.specialty !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      (formData.bio.trim() === "" || formData.bio.trim().length >= 20)
    )
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
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

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to temp trainer page
        router.push(data.redirectUrl)
      } else {
        console.error("Form submission failed:", data.error)
        // Handle error - could show toast or error message
        alert(data.error || "Failed to create trainer profile. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Stand out. Book clients.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Your Professional Trainer Website in 10 minutes</h1>
          <p className="text-xl mb-8 text-blue-100">
            Launch a high-converting one-page site that captures leads and books sessions for you. Just complete a short
            form and your personal-training brand goes live – with SEO and client-ready.
          </p>

          {/* CTA Button */}
          <div className="mb-8">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate for free
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Increase visibility
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-300" />
              Ready in 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Professional design
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Trainers Trust Us</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Website Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="trainer-form" className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Trainer Profile</h2>
            <p className="text-gray-600">Fill out this form to get your own page. No coding required.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trainer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
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
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Vienna"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="district">
                      District <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      placeholder="Innere Stadt"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      className={errors.district ? "border-red-500" : ""}
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialty">
                    Primary Specialty <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
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
                  <Label htmlFor="bio">Professional Bio (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Tell potential clients about your background, training philosophy, and what makes you unique.
                  </p>
                  <Textarea
                    id="bio"
                    placeholder="I am a certified personal trainer with over 5 years of experience helping clients achieve their fitness goals. My approach focuses on sustainable lifestyle changes and personalized workout plans that fit your schedule and preferences."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={`min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                    <p className="text-sm text-gray-400 ml-auto">{formData.bio.length}/500 characters</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications & Qualifications</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    List your certifications, degrees, or other qualifications (comma-separated).
                  </p>
                  <Input
                    id="certifications"
                    placeholder="NASM-CPT, ACE Personal Trainer, Nutrition Specialist"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Services Offered (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-4">Select all services you provide to your clients.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.services.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <Label htmlFor={service} className="text-sm font-normal cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 text-lg"
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? "Generating Your Website..." : "Generate My Website →"}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Your website will be generated instantly. You'll have 24 hours to review and activate it for €70.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
