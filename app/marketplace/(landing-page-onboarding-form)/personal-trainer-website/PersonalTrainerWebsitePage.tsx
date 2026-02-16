"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { formAnalytics, calculateLeadQualityScore, getUserProperties } from "@/lib/analytics"

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

async function parseApiResponse(response: Response): Promise<{ ok: boolean; status: number; body: any }> {
  const contentType = response.headers.get("content-type") || ""
  try {
    if (contentType.includes("application/json")) {
      const json = await response.json()
      return { ok: response.ok, status: response.status, body: json }
    } else {
      const text = await response.text()
      return { ok: response.ok, status: response.status, body: text ? { message: text } : {} }
    }
  } catch (err) {
    console.error("Failed to parse API response", err)
    return { ok: response.ok, status: response.status, body: {} }
  }
}

export default function PersonalTrainerWebsitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formStartTime, setFormStartTime] = useState<number>(Date.now())
  const [fieldFocusTimes, setFieldFocusTimes] = useState<Record<string, number>>({})
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false)
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

  const trackFormStartOnce = () => {
    if (!hasTrackedFormStart) {
      formAnalytics.formStart("trainer_website_form", "personal_trainer_website", formSteps.length)
      setHasTrackedFormStart(true)
      setFormStartTime(Date.now())
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    trackFormStartOnce()

    setFormData((prev) => ({ ...prev, [field]: value }))
    if ((errors as any)[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFieldFocus = (fieldName: string, fieldType = "text") => {
    trackFormStartOnce()
    formAnalytics.fieldFocus("trainer_website_form", fieldName, fieldType)
    setFieldFocusTimes((prev) => ({ ...prev, [fieldName]: Date.now() }))
  }

  const handleFieldBlur = (fieldName: string, value: string) => {
    const focusTime = fieldFocusTimes[fieldName]
    const timeSpent = focusTime ? Math.round((Date.now() - focusTime) / 1000) : undefined
    formAnalytics.fieldBlur("trainer_website_form", fieldName, !!value.trim(), timeSpent)
  }

  const validateCurrentStep = (): boolean => {
    const currentFields = formSteps[currentStep].fields
    const newErrors: FormErrors = {}

    currentFields.forEach((field) => {
      let errorMessage = ""

      if (field === "fullName" && !formData.fullName.trim()) {
        errorMessage = "Full name is required"
        newErrors.fullName = errorMessage
      }
      if (field === "email") {
        if (!formData.email.trim()) {
          errorMessage = "Email is required"
          newErrors.email = errorMessage
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errorMessage = "Please enter a valid email address"
          newErrors.email = errorMessage
        }
      }
      if (field === "city" && !formData.city.trim()) {
        errorMessage = "City is required"
        newErrors.city = errorMessage
      }
      if (field === "district" && !formData.district.trim()) {
        errorMessage = "District is required"
        newErrors.district = errorMessage
      }
      if (field === "specialty" && !formData.specialty) {
        errorMessage = "Please select your primary specialty"
        newErrors.specialty = errorMessage
      }
      if (field === "bio" && formData.bio.trim() && formData.bio.trim().length < 20) {
        errorMessage = "Bio must be at least 20 characters if provided"
        newErrors.bio = errorMessage
      }
      if (field === "bio" && formData.bio.trim() && formData.bio.trim().length > 500) {
        errorMessage = "Bio must be less than 500 characters"
        newErrors.bio = errorMessage
      }

      if (errorMessage) {
        formAnalytics.validationError("trainer_website_form", field, errorMessage, currentStep + 1)
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep() && canProceedToNext() && currentStep < formSteps.length - 1) {
      formAnalytics.stepComplete(
        "trainer_website_form",
        currentStep + 1,
        formSteps[currentStep].title,
        formSteps.length,
      )
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
    if (currentStep !== formSteps.length - 1) return
    if (!validateCurrentStep()) return

    formAnalytics.submitAttempt("trainer_website_form", currentStep + 1)
    setIsSubmitting(true)

    try {
      const { ok, status, body } = await doSubmit()
      const completionTime = Math.round((Date.now() - formStartTime) / 1000)

      if (ok && body?.success) {
        const userProperties = getUserProperties()
        const leadQualityScore = calculateLeadQualityScore(formData, userProperties)

        formAnalytics.submitSuccess("trainer_website_form", completionTime, leadQualityScore)
        return router.push(body.redirectUrl)
      }

      const msg =
        body?.error || body?.message || `Failed to create trainer profile. Server responded with status ${status}.`
      formAnalytics.submitError("trainer_website_form", msg, currentStep + 1)
      console.error("Form submission failed:", { status, body })
      alert(msg)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      formAnalytics.submitError("trainer_website_form", errorMessage, currentStep + 1)
      console.error("Form submission error:", err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasTrackedFormStart && currentStep < formSteps.length - 1) {
        const completionTime = Math.round((Date.now() - formStartTime) / 1000)
        formAnalytics.formAbandon("trainer_website_form", currentStep + 1, formSteps[currentStep].title, completionTime)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasTrackedFormStart, currentStep, formStartTime])


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
      if (field === "bio" || field === "certifications" || "phone") {
        return true
      }
      return (formData as any)[field] !== ""
    }).length
  }

  const getRequiredFieldsCount = () => {
    return 6 // informational only
  }

  const canProceedToNext = (): boolean => {
    if (currentStep === 0) {
      return (
        formData.fullName.trim() !== "" &&
        formData.email.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      )
    }
    if (currentStep === 1) {
      return formData.specialty !== ""
    }
    if (currentStep === 2) {
      return formData.city.trim() !== "" && formData.district.trim() !== ""
    }
    return true
  }

  const handleServiceToggle = (service: string, event?: React.MouseEvent) => {
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

  const doSubmit = async () => {
    const response = await fetch("/api/trainer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    return parseApiResponse(response)
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
                onFocus={() => handleFieldFocus("fullName", "text")}
                onBlur={(e) => handleFieldBlur("fullName", e.target.value)}
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
                onFocus={() => handleFieldFocus("email", "email")}
                onBlur={(e) => handleFieldBlur("email", e.target.value)}
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
                onFocus={() => handleFieldFocus("phone", "text")}
                onBlur={(e) => handleFieldBlur("phone", e.target.value)}
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
                onFocus={() => handleFieldFocus("city", "text")}
                onBlur={(e) => handleFieldBlur("city", e.target.value)}
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
                onFocus={() => handleFieldFocus("district", "text")}
                onBlur={(e) => handleFieldBlur("district", e.target.value)}
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
            <p className="text-sm text-gray-700 mt-1 mb-2">
              Tell potential clients about your background, training philosophy, and what makes you unique. (Optional)
            </p>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              onFocus={() => handleFieldFocus("bio", "textarea")}
              onBlur={(e) => handleFieldBlur("bio", e.target.value)}
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
            <p className="text-sm text-gray-700 mt-1 mb-2">
              List your certifications, degrees, or other qualifications (comma-separated).
            </p>
            <Input
              id="certifications"
              value={formData.certifications}
              onChange={(e) => handleInputChange("certifications", e.target.value)}
              onFocus={() => handleFieldFocus("certifications", "text")}
              onBlur={(e) => handleFieldBlur("certifications", e.target.value)}
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
            <p className="text-sm text-gray-700 mt-1 mb-4">
              Select the services you provide to your clients. (Optional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-3">
                  <Checkbox
                    id={service}
                    checked={formData.services?.includes(service) || false}
                    onCheckedChange={() => handleServiceToggle(service)}
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
      <Navbar />

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
              <span className="text-gray-900">Get Your Professional</span>{" "}
              <span className="text-gray-900 relative">
                Trainer Website
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#D2FF28] opacity-80 rounded"></div>
              </span>{" "}
              <span className="bg-black text-white px-3 py-1 rounded leading-none inline-block">in 10 minutes</span>
            </h1>

            <p className="text-xl text-gray-800 mb-8 leading-relaxed max-w-3xl">
              Launch a high-converting one-page site that captures leads and books sessions for you. Just complete a
              short form and your personal-training brand goes live – with SEO and client-ready.
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <Button
                asChild
                className="bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a
                  href="https://app.juice.fitness/trainer-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create for free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <p className="text-sm text-gray-800 mt-3 max-w-md">We won't charge you for creating the page.</p>
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

      {/* Footer Section */}
      <Footer />
    </div>
  )
}
