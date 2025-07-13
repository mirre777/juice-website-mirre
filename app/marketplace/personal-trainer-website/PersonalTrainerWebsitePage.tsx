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
import { CheckCircle, Loader2, Star, Users, Calendar, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
  "Program Design",
  "Injury Prevention",
]

const benefits = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "Reach More Clients",
    description: "Connect with fitness enthusiasts in your area looking for professional guidance.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-green-600" />,
    title: "Flexible Scheduling",
    description: "Set your own hours and availability to match your lifestyle.",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
    title: "Grow Your Business",
    description: "Build your reputation and expand your client base with our platform.",
  },
  {
    icon: <Star className="h-6 w-6 text-yellow-600" />,
    title: "Professional Profile",
    description: "Showcase your expertise with a detailed, professional trainer profile.",
  },
]

export default function PersonalTrainerWebsitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        toast.success("Profile created successfully! Redirecting to your temporary profile...")
        setTimeout(() => {
          router.push(result.redirectUrl)
        }, 1500)
      } else {
        toast.error(result.error || "Failed to create profile. Please try again.")
        console.error("Form submission error:", result)
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.")
      console.error("Network error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.location &&
    formData.specialty &&
    formData.experience &&
    formData.bio.length >= 50 &&
    formData.services.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Launch Your Personal Training Career</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Create your professional trainer profile and start connecting with clients today
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free to Start
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Professional Profile
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Client Management
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Why Join Our Platform?</CardTitle>
                <CardDescription>Everything you need to grow your personal training business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Trainer Profile</CardTitle>
                <CardDescription>
                  Fill out the form below to get started. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">
                          Location <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="City, State"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">
                          Primary Specialty <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.specialty}
                          onValueChange={(value) => handleInputChange("specialty", value)}
                          required
                        >
                          <SelectTrigger>
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">
                          Experience Level <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.experience}
                          onValueChange={(value) => handleInputChange("experience", value)}
                          required
                        >
                          <SelectTrigger>
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
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        Professional Bio <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell potential clients about your background, training philosophy, and what makes you unique as a trainer..."
                        className="min-h-[120px] resize-y"
                        required
                      />
                      <p className="text-sm text-gray-500">
                        {formData.bio.length}/500 characters (minimum 50 required)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Input
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        placeholder="e.g., NASM-CPT, ACE, ACSM (separate multiple with commas)"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Services */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Services Offered <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-600">Select all services you provide (choose at least one)</p>
                    <div className="grid md:grid-cols-2 gap-3">
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

                  <Separator />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Your Profile...
                        </>
                      ) : (
                        "Create My Trainer Profile"
                      )}
                    </Button>
                    {!isFormValid && (
                      <p className="text-sm text-red-600 mt-2 text-center">
                        Please fill in all required fields to continue
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
