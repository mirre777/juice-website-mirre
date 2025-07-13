"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  specialization: string
  experience: string
  bio: string
  certifications: string
  location: string
  services: string
  pricing: string
  availability: string
  socialMedia: string
}

export default function PersonalTrainerWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    bio: "",
    certifications: "",
    location: "",
    services: "",
    pricing: "",
    availability: "",
    socialMedia: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

      if (response.ok) {
        const result = await response.json()
        setSubmitted(true)
        console.log("Trainer profile created:", result)
      } else {
        console.error("Failed to create trainer profile")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Success!</CardTitle>
            <CardDescription>
              Your trainer profile has been created successfully. We'll review your information and get back to you
              within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Personal Trainer Website</h1>
          <p className="text-xl text-gray-600">
            Get a professional website to showcase your services and attract new clients
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
            <CardDescription>Fill out this form to create your professional trainer website</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  placeholder="Weight Loss, Strength Training, Yoga"
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="5 years"
                />
              </div>

              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  placeholder="NASM-CPT, ACE Personal Trainer, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell potential clients about your background, philosophy, and what makes you unique..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="services">Services Offered</Label>
                <Textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) => handleInputChange("services", e.target.value)}
                  placeholder="Personal Training Sessions, Group Classes, Nutrition Coaching, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pricing">Pricing Information</Label>
                <Textarea
                  id="pricing"
                  value={formData.pricing}
                  onChange={(e) => handleInputChange("pricing", e.target.value)}
                  placeholder="1-on-1 Training: $75/session, Group Classes: $25/session, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  placeholder="Monday-Friday 6AM-8PM, Weekends by appointment"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="socialMedia">Social Media Links</Label>
                <Textarea
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                  placeholder="Instagram: @yourhandle, Facebook: facebook.com/yourpage, etc."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Creating Your Website..." : "Create My Website"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
