'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FormData {
  fullName: string
  email: string
  phone: string
  city: string
  district: string
  specialty: string
  certifications: string
  bio: string
  services: string[]
}

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic information about you' },
  { id: 2, title: 'Location', description: 'Where you provide services' },
  { id: 3, title: 'Expertise', description: 'Your specialty and qualifications' },
  { id: 4, title: 'About You', description: 'Tell clients about yourself' },
  { id: 5, title: 'Services', description: 'What services you offer' },
  { id: 6, title: 'Review', description: 'Review and create your profile' },
]

const SPECIALTIES = [
  'Weight Loss',
  'Strength Training',
  'Cardio Training',
  'Sports Performance',
  'Rehabilitation',
  'Nutrition Coaching',
  'Group Fitness',
  'Yoga/Pilates',
  'Senior Fitness',
  'Youth Training'
]

const SERVICES = [
  'Personal Training',
  'Group Fitness',
  'Online Coaching',
  'Nutrition Coaching',
  'Weight Loss Programs',
  'Strength Training',
  'Cardio Training',
  'Sports-Specific Training',
  'Flexibility & Mobility',
  'Rehabilitation'
]

export default function PersonalTrainerWebsitePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    specialty: '',
    certifications: '',
    bio: '',
    services: []
  })

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const getCompletedFields = () => {
    let completed = 0
    const total = 9 // Total number of fields

    if (formData.fullName.trim()) completed++
    if (formData.email.trim()) completed++
    if (formData.phone.trim()) completed++
    if (formData.city.trim()) completed++
    if (formData.district.trim()) completed++
    if (formData.specialty.trim()) completed++
    if (formData.certifications.trim()) completed++
    if (formData.bio.trim()) completed++
    if (formData.services.length > 0) completed++

    return { completed, total }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim() && formData.email.trim() && formData.phone.trim()
      case 2:
        return formData.city.trim() && formData.district.trim()
      case 3:
        return formData.specialty.trim()
      case 4:
        return true // Bio is optional
      case 5:
        return true // Services are optional
      case 6:
        return formData.fullName.trim() && formData.email.trim() && formData.city.trim() && formData.district.trim() && formData.specialty.trim()
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleExplicitSubmit = async () => {
    console.log("🚀 [FORM SUBMIT] Starting form submission...")
    console.log("📋 [FORM SUBMIT] Form data:", formData)
    
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log("🌐 [FORM SUBMIT] Making API request...")
      const response = await fetch('/api/trainer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log("📡 [FORM SUBMIT] Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.log("❌ [FORM SUBMIT] Response not ok, getting text...")
        const errorText = await response.text()
        console.log("📄 [FORM SUBMIT] Error response text:", errorText)
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      console.log("✅ [FORM SUBMIT] Response is ok, parsing JSON...")
      const result = await response.json()
      console.log("📦 [FORM SUBMIT] Parsed result:", result)

      if (result.success) {
        console.log("🎉 [FORM SUBMIT] Success! Redirecting to:", result.redirectUrl)
        window.location.href = result.redirectUrl
      } else {
        console.log("❌ [FORM SUBMIT] API returned error:", result.error)
        setSubmitError(result.error || 'Failed to create trainer profile')
      }
    } catch (error) {
      console.log("💥 [FORM SUBMIT] Caught error:")
      console.log("Error type:", typeof error)
      console.log("Error constructor:", error?.constructor?.name)
      console.log("Error message:", error instanceof Error ? error.message : String(error))
      console.log("Full error:", error)
      
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="Enter your city"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="district">District/Area *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => updateFormData('district', e.target.value)}
                placeholder="Enter your district or area"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialty">Primary Specialty *</Label>
              <select
                id="specialty"
                value={formData.specialty}
                onChange={(e) => updateFormData('specialty', e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your specialty</option>
                {SPECIALTIES.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="certifications">Certifications (Optional)</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => updateFormData('certifications', e.target.value)}
                placeholder="List your certifications (e.g., NASM-CPT, ACE, ACSM)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">About You (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                placeholder="Tell potential clients about your experience, training philosophy, and what makes you unique..."
                className="mt-1"
                rows={6}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will appear on your website to help clients get to know you better.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Services Offered</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select the services you provide to your clients. (Optional)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <Label htmlFor={service} className="text-sm font-normal">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
              <p className="text-muted-foreground">
                Please review your information before creating your trainer profile.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="font-medium">{formData.city}, {formData.district}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Specialty</Label>
                  <p className="font-medium">{formData.specialty}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Services</Label>
                  <p className="font-medium">{formData.services.length > 0 ? formData.services.join(', ') : 'None selected'}</p>
                </div>
              </div>

              {formData.certifications && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certifications</Label>
                  <p className="font-medium">{formData.certifications}</p>
                </div>
              )}

              {formData.bio && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                  <p className="font-medium">{formData.bio}</p>
                </div>
              )}
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Form submission error: {submitError}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-center">
                Your website will be generated instantly. You can edit and activate it for{' '}
                <Badge variant="secondary" className="mx-1">€70</Badge>
                . You will not be charged anything by creating the Preview.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const { completed, total } = getCompletedFields()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Trainer Profile</CardTitle>
            <CardDescription>
              Step {currentStep} of {STEPS.length}
            </CardDescription>
            <div className="text-right text-sm text-muted-foreground">
              {completed} of {total} fields completed
            </div>
          </CardHeader>

          <CardContent>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{STEPS[currentStep - 1].title}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / STEPS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleExplicitSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
