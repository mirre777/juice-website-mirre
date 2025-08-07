'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft, Check, Star, Users, Clock, Globe, Zap, Shield, Smartphone } from 'lucide-react'

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
  { id: 5, title: 'Services Offered', description: 'What services you provide' },
  { id: 6, title: 'Review', description: 'Review and submit' }
]

const SPECIALTIES = [
  'Personal Training',
  'Weight Loss',
  'Strength Training',
  'Cardio Training',
  'Sports Performance',
  'Rehabilitation',
  'Nutrition Coaching',
  'Group Fitness',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Bodybuilding'
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
  'Rehabilitation',
  'Flexibility & Mobility'
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

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const getCompletedFields = () => {
    let completed = 0
    if (formData.fullName.trim()) completed++
    if (formData.email.trim()) completed++
    if (formData.phone.trim()) completed++
    if (formData.city.trim()) completed++
    if (formData.district.trim()) completed++
    if (formData.specialty.trim()) completed++
    if (formData.certifications.trim()) completed++
    if (formData.bio.trim()) completed++
    if (formData.services.length > 0) completed++
    return completed
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
        return true // Bio and certifications are optional
      case 5:
        return true // Services are optional
      case 6:
        return formData.fullName.trim() && formData.email.trim() && formData.city.trim() && formData.district.trim() && formData.specialty.trim()
      default:
        return false
    }
  }

  const handleExplicitSubmit = async () => {
    console.log('🚀 [FORM SUBMIT] Starting form submission...')
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log('📋 [FORM SUBMIT] Form data:', formData)
      
      const response = await fetch('/api/trainer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('📡 [FORM SUBMIT] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        console.log('❌ [FORM SUBMIT] Response not ok, attempting to parse error...')
        
        let errorMessage = `Server error: ${response.status}`
        
        try {
          const errorData = await response.json()
          console.log('📄 [FORM SUBMIT] Error data parsed:', errorData)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (parseError) {
          console.log('⚠️ [FORM SUBMIT] Could not parse error response as JSON:', parseError)
          
          try {
            const errorText = await response.text()
            console.log('📄 [FORM SUBMIT] Error response text:', errorText.substring(0, 200))
            errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}`
          } catch (textError) {
            console.log('⚠️ [FORM SUBMIT] Could not parse error response as text:', textError)
          }
        }
        
        throw new Error(errorMessage)
      }

      console.log('✅ [FORM SUBMIT] Response ok, parsing JSON...')
      const result = await response.json()
      console.log('🎉 [FORM SUBMIT] Success result:', result)

      if (result.success && result.redirectUrl) {
        console.log('🔄 [FORM SUBMIT] Redirecting to:', result.redirectUrl)
        window.location.href = result.redirectUrl
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('💥 [FORM SUBMIT] Error during submission:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepProgress = () => {
    return Math.round((getCompletedFields() / 9) * 100)
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
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
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
                placeholder="e.g., Berlin, Vienna, Amsterdam"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="district">District/Area *</Label>
              <Input
                id="district"
                placeholder="e.g., Mitte, Prenzlauer Berg"
                value={formData.district}
                onChange={(e) => updateFormData('district', e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialty">Primary Specialty *</Label>
              <Select value={formData.specialty} onValueChange={(value) => updateFormData('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="certifications">Certifications & Qualifications</Label>
              <Textarea
                id="certifications"
                placeholder="List your certifications, degrees, and qualifications..."
                value={formData.certifications}
                onChange={(e) => updateFormData('certifications', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                placeholder="Tell potential clients about your experience, approach, and what makes you unique..."
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                rows={5}
              />
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
                {SERVICES.map((service) => (
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
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {formData.fullName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {formData.phone}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.city}, {formData.district}
                </div>
                <div>
                  <span className="font-medium">Specialty:</span> {formData.specialty}
                </div>
                {formData.certifications && (
                  <div>
                    <span className="font-medium">Certifications:</span> {formData.certifications}
                  </div>
                )}
                {formData.bio && (
                  <div>
                    <span className="font-medium">Bio:</span> {formData.bio.substring(0, 100)}...
                  </div>
                )}
                {formData.services.length > 0 && (
                  <div>
                    <span className="font-medium">Services:</span> {formData.services.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
            Launch in 10 Minutes
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Personal Trainer Website
            <span className="text-orange-500"> Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            No coding needed. Get a professional website that books clients, ranks in search, and grows your fitness business automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>Free Preview</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>Live in Minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600">European Trainers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">10 Min</div>
              <div className="text-gray-600">Average Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SEO Optimized</h3>
              <p className="text-gray-600">Rank higher in local search results and get found by more clients.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Ready</h3>
              <p className="text-gray-600">Perfect on all devices. Your clients can book from anywhere.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Super fast loading times keep visitors engaged.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Built with enterprise-grade security and 99.9% uptime.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">Easy booking system and client communication tools.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it with our dedicated support team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Trainers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Got my website live in under 10 minutes. Already booked 3 new clients this week!"
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-gray-500">Personal Trainer, Berlin</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, a website that actually brings me clients. The SEO is incredible!"
                </p>
                <div className="font-semibold">Marcus K.</div>
                <div className="text-sm text-gray-500">Strength Coach, Vienna</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Professional, fast, and effective. My business has grown 40% since launch."
                </p>
                <div className="font-semibold">Lisa R.</div>
                <div className="text-sm text-gray-500">Fitness Coach, Amsterdam</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Create Your Trainer Profile</h2>
            <p className="text-gray-600">
              Step {currentStep} of {STEPS.length}
            </p>
            <div className="text-sm text-gray-500 mt-2">
              {getCompletedFields()} of 9 fields completed
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg">{STEPS[currentStep - 1].title}</CardTitle>
                  <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">{getStepProgress()}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              {renderStep()}

              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep === STEPS.length ? (
                  <Button
                    onClick={handleExplicitSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Show Preview'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {currentStep === STEPS.length && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Your website will be generated instantly. You can edit and activate it for{' '}
                    <span className="font-semibold bg-yellow-200 px-1 rounded">€70</span>.{' '}
                    <span className="font-semibold">You will not be charged anything by creating the Preview.</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Fitness Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of successful trainers who've transformed their business with a professional website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Start Building Now
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View Examples
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
