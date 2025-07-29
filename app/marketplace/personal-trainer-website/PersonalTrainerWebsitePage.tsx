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
import { CheckCircle, Clock, Star, ArrowDown, ChevronRight, ChevronLeft } from "lucide-react"
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

// Define form steps
const formSteps = [
  { id: "basic", fields: ["fullName", "email"], title: "Basic Information" },
  { id: "contact", fields: ["phone", "specialty"], title: "Contact & Specialty" },
  { id: "location", fields: ["city", "district"], title: "Location" },
  { id: "bio", fields: ["bio"], title: "Professional Bio" },
  { id: "certifications", fields: ["certifications"], title: "Certifications" },
  { id: "services", fields: ["services"], title: "Services Offered" },
]

// Trust Shield SVG Component
const TrustShield = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
      fill="#000000"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function PersonalTrainerWebsitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
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

  // Calculate progress
  const getFieldValue = (field: string) => {
    if (field === "services") {
      return formData.services.length > 0
    }
    return formData[field as keyof FormData] !== ""
  }

  const getTotalFilledFields = () => {
    const allFields = [
      "fullName",
      "email",
      "phone",
      "specialty",
      "city",
      "district",
      "bio",
      "certifications",
      "services",
    ]
    return allFields.filter((field) => {
      if (field === "services") {
        return formData.services.length > 0
      }
      if (field === "bio" || field === "certifications" || field === "phone") {
        // Optional fields
        return true
      }
      return formData[field as keyof FormData] !== ""
    }).length
  }

  const getRequiredFieldsCount = () => {
    return 6 // fullName, email, specialty, city, district + at least one optional field
  }

  const validateCurrentStep = (): boolean => {
    const currentFields = formSteps[currentStep].fields
    const newErrors: FormErrors = {}

    currentFields.forEach((field) => {
      if (field === "fullName" && !formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      }
      if (field === "email") {
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
      }
      if (field === "city" && !formData.city.trim()) {
        newErrors.city = "City is required"
      }
      if (field === "district" && !formData.district.trim()) {
        newErrors.district = "District is required"
      }
      if (field === "specialty" && !formData.specialty) {
        newErrors.specialty = "Please select your primary specialty"
      }
      if (field === "bio" && formData.bio.trim() && formData.bio.trim().length < 20) {
        newErrors.bio = "Bio must be at least 20 characters if provided"
      }
      if (field === "bio" && formData.bio.trim() && formData.bio.trim().length > 500) {
        newErrors.bio = "Bio must be less than 500 characters"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canProceedToNext = (): boolean => {
    const currentFields = formSteps[currentStep].fields

    // For required fields steps
    if (currentStep === 0) {
      // Basic info
      return (
        formData.fullName.trim() !== "" &&
        formData.email.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      )
    }
    if (currentStep === 1) {
      // Contact & Specialty
      return formData.specialty !== ""
    }
    if (currentStep === 2) {
      // Location
      return formData.city.trim() !== "" && formData.district.trim() !== ""
    }

    // Optional steps can always proceed
    return true
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleServiceToggle = (service: string, event?: React.MouseEvent) => {
    // Prevent any event bubbling that might trigger form submission
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const nextStep = () => {
    if (validateCurrentStep() && canProceedToNext() && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only submit if we're on the last step
    if (currentStep !== formSteps.length - 1) {
      return
    }

    if (!validateCurrentStep()) {
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
        router.push(data.redirectUrl)
      } else {
        console.error("Form submission failed:", data.error)
        alert(data.error || "Failed to create trainer profile. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExplicitSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only submit if we're on the last step
    if (currentStep !== formSteps.length - 1) {
      return
    }

    if (!validateCurrentStep()) {
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
        router.push(data.redirectUrl)
      } else {
        console.error("Form submission failed:", data.error)
        alert(data.error || "Failed to create trainer profile. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStepFields = () => {
    const step = formSteps[currentStep]

    switch (step.id) {
      case "basic":
        return (
          <div className="space-y-6">
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
        )

      case "contact":
        return (
          <div className="space-y-6">
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
        )

      case "location":
        return (
          <div className="space-y-6">
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
        )

      case "bio":
        return (
          <div>
            <Label htmlFor="bio" className="text-base font-medium">
              Professional Bio
            </Label>
            <p className="text-sm text-gray-600 mt-1 mb-2">
              Tell potential clients about your background, training philosophy, and what makes you unique. (Optional)
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
        )

      case "certifications":
        return (
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
        )

      case "services":
        return (
          <div>
            <Label className="text-base font-medium">Services Offered</Label>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              Select the services you provide to your clients. (Optional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-3">
                  <Checkbox
                    id={service}
                    checked={formData.services?.includes(service) || false}
                    onCheckedChange={(checked) => {
                      // Only update the state, don't trigger any form submission
                      handleServiceToggle(service)
                    }}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor={service}
                    className="text-sm font-medium cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleServiceToggle(service, e)
                    }}
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
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
                <TrustShield className="w-8 h-8" />
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
              <span className="bg-black text-white px-3 py-1 rounded leading-none inline-block">in 10 minutes</span>
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

              {/* Progress Indicator */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {formSteps.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getTotalFilledFields()} of {getRequiredFieldsCount()} fields completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#D2FF28] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">{formSteps[currentStep].title}</p>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleFormSubmit}>
                <div className="min-h-[300px]">{renderCurrentStepFields()}</div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 mt-8 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < formSteps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToNext()}
                      className="bg-[#D2FF28] hover:bg-[#B8E625] text-black flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleExplicitSubmit}
                      disabled={isSubmitting}
                      className="bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold px-8 py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        "Show Preview"
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Your website will be generated <strong>instantly</strong>. You can edit and activate it for{" "}
                <span className="bg-[#D2FF28] text-black px-1 py-0.5 rounded font-medium">€70.</span> You will not be
                charged anything by creating the Preview.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
