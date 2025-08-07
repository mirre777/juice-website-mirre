'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Star, Users, Clock, Shield, Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const steps = [
  { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Location', description: 'Where do you train?' },
  { id: 3, title: 'Specialty', description: 'What\'s your expertise?' },
  { id: 4, title: 'Certifications', description: 'Your qualifications' },
  { id: 5, title: 'Bio & Services', description: 'Describe your services' },
  { id: 6, title: 'Review', description: 'Confirm your details' }
]

const specialties = [
  'Weight Loss',
  'Muscle Building',
  'Strength Training',
  'Cardio Training',
  'Bodybuilding',
  'Powerlifting',
  'CrossFit',
  'Functional Training',
  'Sports Performance',
  'Rehabilitation',
  'Yoga',
  'Pilates',
  'Nutrition Coaching',
  'Senior Fitness',
  'Youth Training'
]

const cities = [
  { name: 'Berlin', districts: ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Charlottenburg', 'Friedrichshain', 'Neukölln', 'Schöneberg', 'Wedding', 'Moabit', 'Tempelhof'] },
  { name: 'München', districts: ['Altstadt', 'Maxvorstadt', 'Schwabing', 'Haidhausen', 'Glockenbachviertel', 'Sendling', 'Bogenhausen', 'Laim', 'Pasing', 'Giesing'] },
  { name: 'Hamburg', districts: ['St. Pauli', 'Altona', 'Eimsbüttel', 'Winterhude', 'Eppendorf', 'Harvestehude', 'Blankenese', 'Ottensen', 'Sternschanze', 'HafenCity'] },
  { name: 'Wien', districts: ['Innere Stadt', 'Leopoldstadt', 'Landstraße', 'Wieden', 'Margareten', 'Mariahilf', 'Neubau', 'Josefstadt', 'Alsergrund', 'Favoriten'] },
  { name: 'Zürich', districts: ['Altstadt', 'Enge', 'Wiedikon', 'Aussersihl', 'Gewerbeschule', 'Unterstrass', 'Oberstrass', 'Fluntern', 'Hottingen', 'Hirslanden'] },
  { name: 'Amsterdam', districts: ['Centrum', 'Noord', 'Oost', 'West', 'Zuid', 'Nieuw-West', 'Zuidoost', 'Westpoort'] },
  { name: 'København', districts: ['Indre By', 'Østerbro', 'Nørrebro', 'Vesterbro', 'Frederiksberg', 'Amager', 'Valby', 'Vanløse', 'Brønshøj', 'Bispebjerg'] }
]

export default function PersonalTrainerWebsitePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    specialty: '',
    certifications: '',
    bio: '',
    services: [] as string[]
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('🚀 [FORM SUBMIT] Starting form submission...')
    console.log('📋 [FORM SUBMIT] Form data:', formData)
    
    setIsSubmitting(true)
    
    try {
      console.log('📤 [FORM SUBMIT] Sending request to /api/trainer/create...')
      const response = await fetch('/api/trainer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('📥 [FORM SUBMIT] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ [FORM SUBMIT] Error response:', errorData)
        throw new Error(errorData.error || 'Failed to create trainer profile')
      }

      console.log('✅ [FORM SUBMIT] Response is ok, parsing JSON...')
      const result = await response.json()
      console.log('📋 [FORM SUBMIT] Parsed result:', result)

      if (result.success) {
        console.log('🎉 [FORM SUBMIT] Success! Redirecting to:', result.redirectUrl)
        router.push(result.redirectUrl)
      } else {
        throw new Error(result.error || 'Failed to create trainer profile')
      }
    } catch (error) {
      console.error('💥 [FORM SUBMIT] Error during submission:', error)
      alert('Failed to create trainer profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCity = cities.find(city => city.name === formData.city)

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
              <Label htmlFor="email">Email Address *</Label>
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+49 123 456 7890"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => {
                handleInputChange('city', value)
                handleInputChange('district', '') // Reset district when city changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCity && (
              <div>
                <Label htmlFor="district">District *</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCity.districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialty">Primary Specialty *</Label>
              <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
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
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="certifications">Certifications & Qualifications</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="List your certifications, qualifications, and relevant experience..."
                rows={4}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell potential clients about your training philosophy, experience, and what makes you unique..."
                rows={4}
              />
            </div>
            <div>
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Personal Training', 'Group Training', 'Online Coaching', 'Nutrition Consulting', 'Fitness Assessment', 'Rehabilitation'].map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('services', [...formData.services, service])
                        } else {
                          handleInputChange('services', formData.services.filter(s => s !== service))
                        }
                      }}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
              <p><strong>Location:</strong> {formData.city}, {formData.district}</p>
              <p><strong>Specialty:</strong> {formData.specialty}</p>
              <p><strong>Certifications:</strong> {formData.certifications || 'Not provided'}</p>
              <p><strong>Bio:</strong> {formData.bio || 'Not provided'}</p>
              <p><strong>Services:</strong> {formData.services.join(', ') || 'None selected'}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim() && formData.email.trim()
      case 2:
        return formData.city && formData.district
      case 3:
        return formData.specialty
      case 4:
      case 5:
        return true
      case 6:
        return formData.fullName.trim() && formData.email.trim() && formData.city && formData.district && formData.specialty
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">No coding required</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professional
              </span>{' '}
              Trainer Website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build a stunning personal trainer website in minutes. Get more clients, showcase your expertise, and grow your fitness business with our easy-to-use platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Professional Templates</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Client Booking System</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Mobile Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Fitness Professionals</h2>
            <p className="text-gray-600">See what trainers are saying about our platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src="/images/laner.png"
                  alt="Laner"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3">
                    "This platform transformed my business! I went from struggling to find clients to being booked solid within 2 months. The website looks incredibly professional."
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">Laner Schmidt</p>
                    <p className="text-sm text-gray-600">Personal Trainer, Berlin</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src="/images/rici.png"
                  alt="Rici"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3">
                    "The booking system is a game-changer. My clients can easily schedule sessions, and I can focus on what I do best - training. Highly recommend!"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">Rici Martinez</p>
                    <p className="text-sm text-gray-600">Fitness Coach, München</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Active Trainers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Platform Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Profile</h2>
            <p className="text-gray-600">Fill out the form below to get started with your professional trainer website</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Step {currentStep} of {steps.length}</CardTitle>
                  <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                </div>
                <Badge variant="outline">{steps[currentStep - 1].title}</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              <Separator className="my-6" />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                
                {currentStep === steps.length ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isSubmitting ? 'Creating...' : 'Show Preview'}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
