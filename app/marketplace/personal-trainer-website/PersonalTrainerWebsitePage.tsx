'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Star, Users, Clock, Shield, ArrowRight, Zap } from 'lucide-react'
import Image from 'next/image'

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

const specialties = [
  'Weight Loss',
  'Muscle Building',
  'Cardio Training',
  'Strength Training',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Nutrition Coaching',
  'Rehabilitation',
  'Sports Performance'
]

const services = [
  'One-on-One Training',
  'Group Classes',
  'Online Coaching',
  'Nutrition Planning',
  'Workout Plans',
  'Progress Tracking'
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

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone)
      case 2:
        return !!(formData.city && formData.district && formData.specialty)
      case 3:
        return !!(formData.certifications && formData.bio)
      case 4:
        return formData.services.length > 0
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    console.log('🚀 [FORM SUBMIT] Starting form submission...')
    console.log('📋 [FORM SUBMIT] Form data:', formData)
    
    if (!validateStep(4)) {
      console.log('❌ [FORM SUBMIT] Form validation failed')
      setSubmitError('Please complete all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log('🌐 [FORM SUBMIT] Sending POST request to /api/trainer/create...')
      
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

      const result = await response.json()
      console.log('📋 [FORM SUBMIT] Parsed result:', result)

      if (response.ok && result.success) {
        console.log('✅ [FORM SUBMIT] Success! Redirecting to:', result.redirectUrl)
        window.location.href = result.redirectUrl
      } else {
        console.log('❌ [FORM SUBMIT] Request failed:', result)
        setSubmitError(result.error || result.details || 'Failed to create trainer profile')
      }
    } catch (error) {
      console.error('💥 [FORM SUBMIT] Network/parsing error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
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
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
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
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                required
              />
            </div>
            <div>
              <Label htmlFor="district">District/Area *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="Enter your district or area"
                required
              />
            </div>
            <div>
              <Label htmlFor="specialty">Primary Specialty *</Label>
              <select
                id="specialty"
                value={formData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select your specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="certifications">Certifications *</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="List your certifications (e.g., NASM-CPT, ACE, ACSM)"
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell potential clients about your experience, approach, and what makes you unique..."
                rows={4}
                required
              />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Services Offered *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map(service => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-yellow-400/10" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-lime-600 mr-2" />
            <Badge variant="secondary" className="bg-lime-100 text-lime-800 border-lime-200">
              No coding required
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build Your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Professional
            </span>{' '}
            Trainer Website
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a stunning website that attracts clients, showcases your expertise, and grows your fitness business. 
            <span className="text-lime-600 font-semibold"> Get started in minutes!</span>
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center text-gray-600">
              <Zap className="h-5 w-5 text-lime-500 mr-2" />
              <span>Quick Setup</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Shield className="h-5 w-5 text-lime-500 mr-2" />
              <span>Professional Design</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 text-lime-500 mr-2" />
              <span>Client Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Trainers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/laner.png"
                    alt="Laner - Personal Trainer"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Laner</h4>
                    <p className="text-sm text-gray-600">Certified Personal Trainer</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "This platform made it incredibly easy to create my professional website. 
                  I went from zero to fully booked in just 2 weeks!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/rici.png"
                    alt="Rici - Fitness Coach"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Rici</h4>
                    <p className="text-sm text-gray-600">Fitness Coach & Nutritionist</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "The client management tools are amazing. I can focus on training 
                  while the website handles bookings and payments automatically."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-lime-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-lime-800 mb-2">500+</div>
              <div className="text-lime-700">Active Trainers</div>
            </div>
            <div className="bg-lime-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-lime-800 mb-2">95%</div>
              <div className="text-lime-700">Client Satisfaction</div>
            </div>
            <div className="bg-lime-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-lime-800 mb-2">24/7</div>
              <div className="text-lime-700">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-lime-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Trainer Profile</CardTitle>
              <CardDescription>
                Step {currentStep} of 4 - {
                  currentStep === 1 ? 'Personal Information' :
                  currentStep === 2 ? 'Location & Specialty' :
                  currentStep === 3 ? 'Credentials & Bio' :
                  'Services Offered'
                }
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {renderStep()}
              
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    className="border-lime-200 text-lime-700 hover:bg-lime-50"
                  >
                    Previous
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <Button 
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="bg-lime-500 hover:bg-lime-600 text-white"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!validateStep(4) || isSubmitting}
                      className="bg-lime-500 hover:bg-lime-600 text-white"
                    >
                      {isSubmitting ? 'Creating...' : 'Show Preview'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
