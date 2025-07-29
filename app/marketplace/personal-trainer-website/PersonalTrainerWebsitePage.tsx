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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-[30px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white border border-black rounded-full">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <div className="bg-white text-black border border-black px-4 py-2 text-lg font-medium rounded-full">
                No coding required
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get Your Professional{" "}
              <span className="text-black relative">
                Trainer Website
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#D2FF28] opacity-80 rounded"></div>
              </span>{" "}
              in 10 minutes
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
              Launch a high-converting one-page site that captures leads and books sessions for you. Just complete a
              short form and your personal-training brand goes live – with SEO and client-ready.
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <Button
                onClick={scrollToForm}
                className="bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create for free
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-8 mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Increase visibility</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Super fast</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Professional design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <img src="/images/laner.png" alt="Laner" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-gray-800 font-medium mb-2">"Super smooth, I had my website in 3 minutes."</p>
                  <p className="text-gray-600 text-sm">- Laner</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <img src="/images/rici.png" alt="Rici" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-gray-800 font-medium mb-2">
                    "I never knew a website could be made this fast and good"
                  </p>
                  <p className="text-gray-600 text-sm">- Rici</p>
                </div>
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
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Trainers Trust Us</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-[#D2FF28] rounded-full">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-[#D2FF28] rounded-full">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Website Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="trainer-form" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stand out. Book clients.</h2>
            <p className="text-xl text-gray-600">Fill out this form to get your own page. No coding required.</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-2xl text-center">Create Your Trainer Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-base font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Smith"
                      className={`mt-2 h-12 ${errors.fullName ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className={`mt-2 h-12 ${errors.email ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                    <Label htmlFor="specialty" className="text-base font-medium">
                      Primary Specialty <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) => handleInputChange("specialty", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={`mt-2 h-12 ${errors.specialty ? "border-red-500" : ""}`}>
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
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Vienna"
                      className={`mt-2 h-12 ${errors.city ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="district" className="text-base font-medium">
                      District <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Innere Stadt"
                      className={`mt-2 h-12 ${errors.district ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                </div>

                {/* Bio - Optional */}
                <div>
                  <Label htmlFor="bio" className="text-base font-medium">
                    Professional Bio
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 mb-2">
                    Tell potential clients about your background, training philosophy, and what makes you unique.
                    (Optional)
                  </p>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="I'm a certified personal trainer with experience helping clients achieve their fitness goals. My approach focuses on sustainable lifestyle changes and personalized workout plans..."
                    className={`mt-2 min-h-32 ${errors.bio ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                    <div className="ml-auto">
                      <span
                        className={`text-sm ${formData.bio.length > 450 ? "text-red-500" : formData.bio.length > 400 ? "text-yellow-600" : "text-gray-500"}`}
                      >
                        {formData.bio.length}/500 characters
                      </span>
                    </div>
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

                {/* Services - Optional */}
                <div>
                  <Label className="text-base font-medium">Services Offered</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    Select the services you provide to your clients. (Optional)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceOptions.map((service) => (
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
                        <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        Creating Your Website...
                      </>
                    ) : (
                      <>
                        Create My Website
                        <ArrowDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Your website will be generated <strong>instantly</strong>. You can edit and activate it for{" "}
                    <span className="bg-[#D2FF28] text-black px-1 py-0.5 rounded font-medium">€70.</span> No one's
                    forcing you.
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
