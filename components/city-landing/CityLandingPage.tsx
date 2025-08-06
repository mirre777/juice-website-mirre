'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Target } from 'lucide-react'

interface CityContent {
  hero: {
    title: string
    subtitle: string
  }
  mainCard: {
    title: string
    description: string
    features: Array<{
      title: string
      description: string
    }>
  }
  sections: {
    beginner: {
      title: string
      description: string
      features: string[]
      callToAction: string
    }
    advanced: {
      title: string
      description: string
      features: string[]
      goals: string[]
      callToAction: string
    }
  }
  app: {
    title: string
    description: string
    buttonText: string
  }
  trainers: {
    title: string
    description: string
    filters: string[]
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    callToAction: string
  }
  form: {
    title: string
    fields: {
      name: string
      email: string
      goal: {
        label: string
        placeholder: string
        options: Array<{ value: string; label: string }>
      }
      district: {
        label: string
        placeholder: string
        options: Array<{ value: string; label: string }>
      }
      startTime: {
        label: string
        placeholder: string
        options: Array<{ value: string; label: string }>
      }
      message: {
        label: string
        placeholder: string
      }
    }
    submitButton: string
    submittingText: string
    successMessage: string
    errorMessage: string
  }
}

interface CityLandingPageProps {
  content: CityContent
}

export default function CityLandingPage({ content }: CityLandingPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    district: '',
    startTime: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitMessage(content.form.successMessage)
      setFormData({ name: '', email: '', goal: '', district: '', startTime: '', message: '' })
    } catch (error) {
      setSubmitMessage(content.form.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {content.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {content.hero.subtitle}
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                {content.mainCard.title}
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              {content.mainCard.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {content.mainCard.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Two Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Beginners Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  {content.sections.beginner.title}
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                {content.sections.beginner.description}
              </p>

              <div className="space-y-3 mb-6">
                {content.sections.beginner.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  {content.sections.beginner.callToAction}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  {content.sections.advanced.title}
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                {content.sections.advanced.description}
              </p>

              <div className="space-y-3 mb-6">
                {content.sections.advanced.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {content.sections.advanced.goals.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {content.sections.advanced.goals.map((goal, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  {content.sections.advanced.callToAction}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Download Section */}
        <Card className="mb-16">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Download className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900">
                {content.app.title}
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              {content.app.description}
            </p>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              {content.app.buttonText}
            </Button>
          </CardContent>
        </Card>

        {/* Local Trainers Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                {content.trainers.title}
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              {content.trainers.description}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {content.trainers.filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">{filter}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Keywords Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {content.seo.title}
            </h3>
            
            <p className="text-gray-700 mb-4">{content.seo.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {content.seo.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
            
            <p className="text-gray-700">
              {content.seo.callToAction}
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {content.form.title}
            </h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">{content.form.fields.name} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{content.form.fields.email} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="goal">{content.form.fields.goal.label} *</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={content.form.fields.goal.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {content.form.fields.goal.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">{content.form.fields.district.label}</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={content.form.fields.district.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {content.form.fields.district.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="startTime">{content.form.fields.startTime.label}</Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={content.form.fields.startTime.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {content.form.fields.startTime.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">{content.form.fields.message.label}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={content.form.fields.message.placeholder}
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? content.form.submittingText : content.form.submitButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
