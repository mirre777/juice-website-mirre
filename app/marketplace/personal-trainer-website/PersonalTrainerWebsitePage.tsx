"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Clock, DollarSign, Star, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"

interface FormData {
  name: string
  email: string
  specialization: string
  bio: string
  experience: string
  certifications: string[]
  location: string
  phone: string
  website: string
  instagram: string
  facebook: string
  hourlyRate: string
  consultationFee: string
}

interface SubmissionResult {
  success: boolean
  trainerId?: string
  tempId?: string
  tempUrl?: string
  message: string
  error?: string
}

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    specialization: "",
    bio: "",
    experience: "",
    certifications: [],
    location: "",
    phone: "",
    website: "",
    instagram: "",
    facebook: "",
    hourlyRate: "",
    consultationFee: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [currentCertification, setCurrentCertification] = useState("")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addCertification = () => {
    if (currentCertification.trim() && !formData.certifications.includes(currentCertification.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, currentCertification.trim()],
      }))
      setCurrentCertification("")
    }
  }

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionResult(null)

    try {
      // Prepare the data for submission
      const submissionData = {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        bio: formData.bio,
        experience: formData.experience,
        certifications: formData.certifications,
        location: formData.location,
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
        },
        socialMedia: {
          instagram: formData.instagram,
          facebook: formData.facebook,
        },
        pricing: {
          hourlyRate: formData.hourlyRate ? Number.parseFloat(formData.hourlyRate) : undefined,
          consultationFee: formData.consultationFee ? Number.parseFloat(formData.consultationFee) : undefined,
        },
        services: [],
        availability: {},
        profileImage: "",
        status: "pending",
      }

      console.log("Submitting trainer data:", submissionData)

      const response = await fetch("/api/trainer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (response.ok && result.success) {
        setSubmissionResult({
          success: true,
          trainerId: result.trainerId,
          tempId: result.tempId,
          tempUrl: result.tempUrl,
          message: result.message || "Your trainer profile has been created successfully!",
        })
      } else {
        setSubmissionResult({
          success: false,
          message: result.error || "Failed to create trainer profile. Please try again.",
          error: result.error,
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      setSubmissionResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const specializations = [
    "Weight Loss",
    "Strength Training",
    "Cardio Fitness",
    "Yoga",
    "Pilates",
    "CrossFit",
    "Bodybuilding",
    "Functional Training",
    "Sports Performance",
    "Rehabilitation",
    "Senior Fitness",
    "Youth Training",
  ]

  if (submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Profile Created Successfully!</CardTitle>
              <CardDescription className="text-green-600">{submissionResult.message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your profile has been submitted for review
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    We'll review your information within 24-48 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    You'll receive an email confirmation once approved
                  </li>
                </ul>
              </div>

              {submissionResult.tempUrl && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Preview Your Profile</h3>
                  <p className="text-sm text-blue-600 mb-3">
                    You can preview your temporary profile while we review your submission:
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a
                      href={submissionResult.tempUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Temporary Profile
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSubmissionResult(null)
                    setFormData({
                      name: "",
                      email: "",
                      specialization: "",
                      bio: "",
                      experience: "",
                      certifications: [],
                      location: "",
                      phone: "",
                      website: "",
                      instagram: "",
                      facebook: "",
                      hourlyRate: "",
                      consultationFee: "",
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another Profile
                </Button>
                <Button asChild className="flex-1">
                  <a href="/marketplace">Browse Trainers</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Personal Trainer Profile</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our platform and connect with clients looking for professional fitness guidance. Build your online
            presence and grow your training business.
          </p>
        </div>

        {submissionResult && !submissionResult.success && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {submissionResult.message}
              {submissionResult.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">Technical Details</summary>
                  <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto">{submissionResult.error}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about yourself and your fitness expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Specialization *</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell potential clients about your background, training philosophy, and what makes you unique..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <Input
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="e.g., 5 years of personal training experience"
                />
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Certifications & Qualifications
              </CardTitle>
              <CardDescription>Add your professional certifications and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentCertification}
                  onChange={(e) => setCurrentCertification(e.target.value)}
                  placeholder="e.g., NASM-CPT, ACE Personal Trainer"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} variant="outline">
                  Add
                </Button>
              </div>

              {formData.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeCertification(cert)}
                    >
                      {cert} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>How can clients reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <Input
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <Input
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="facebook.com/yourpage"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Information
              </CardTitle>
              <CardDescription>Set your rates (you can update these later)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    placeholder="75.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee}
                    onChange={(e) => handleInputChange("consultationFee", e.target.value)}
                    placeholder="25.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="px-8 py-3 text-lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Create My Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
