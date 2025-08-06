'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Users, Smartphone, MapPin, Calendar, Target } from 'lucide-react'

interface FormData {
  name: string
  email: string
  goal: string
  district: string
  startDate: string
  message: string
}

export default function AmsterdamPersonalTrainingClientPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    goal: '',
    district: '',
    startDate: '',
    message: ''
  })

  const amsterdamDistricts = [
    'Centrum',
    'Noord',
    'Oost',
    'West',
    'Zuid',
    'Zuidoost',
    'Nieuw-West'
  ]

  const goals = [
    'Gezondheid',
    'Spiermassa', 
    'Houding',
    'Afvallen'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/debug-amsterdam-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city: 'Amsterdam',
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Bedankt! We nemen binnen 24 uur contact met je op om je te koppelen aan 2 geschikte trainers in Amsterdam.'
        })
        setCurrentStep(4)
      } else {
        throw new Error(result.error || 'Er is iets misgegaan')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitResult({
        success: false,
        message: 'Er is een fout opgetreden. Probeer het opnieuw of neem contact met ons op.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal training in Amsterdam
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Vind jouw trainer
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <CheckCircle className="text-green-500 mr-2" />
              Start zonder gedoe
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Nieuw in de gym? Of al even bezig maar geen progressie? In Amsterdam vind je personal trainers die snappen wat werkt.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Gratis proefles of videogesprek</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="text-blue-500 mr-2 flex-shrink-0" />
                <span>App downloaden als je eerst wilt rondkijken</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beginner Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              🚶 Eerste stap naar gezonder leven?
            </h2>
            <p className="text-xl text-gray-600">
              Geen stress. Veel trainers in Amsterdam werken met mensen die willen starten, maar niet weten hoe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Wat je krijgt:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Gratis proefles in een studio of gym</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Online kennismaking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Training gericht op houding, beweging en basisconditie</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-lg font-medium text-center">
                Vul het formulier in. Wij koppelen je aan 2 trainers die bij jou passen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              🏋️ Kracht, progressie, structuur?
            </h2>
            <p className="text-xl text-gray-600">
              Serieus bezig met krachttraining maar vastgelopen? Amsterdamse coaches kunnen je programmeren, tracken en begeleiden:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Persoonlijk plan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Progressive overload</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>App tracking & feedback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Kennis van hypertrofie & lifting</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Doelen:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Spiermassa</span>
                </li>
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Structuur</span>
                </li>
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Resultaat</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Aanbod:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Gratis intake</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Eerste training terugbetaald bij boeking</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-lg font-medium">
                Vul het formulier in en krijg een coach die levert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            📱 Nog niet klaar om te starten?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Download de app. Bekijk profielen. Toon interesse. Start wanneer jij wilt.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Download de app
          </Button>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Trainers in Amsterdam</h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            We tonen alleen actieve trainers in Amsterdam. Je kunt filteren op:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-center">
              <MapPin className="text-blue-500 mr-2" />
              <span>Stadsdeel</span>
            </div>
            <div className="flex items-center justify-center">
              <Users className="text-green-500 mr-2" />
              <span>Trainingsvorm (studio, thuis, buiten)</span>
            </div>
            <div className="flex items-center justify-center">
              <Target className="text-purple-500 mr-2" />
              <span>Specialisaties</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Populaire zoektermen</h2>
          <p className="text-lg text-gray-600 text-center mb-8">We scoren op:</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <ul className="space-y-2">
              <li>• personal trainer amsterdam</li>
              <li>• gratis proefles personal trainer</li>
              <li>• fitness begeleiding amsterdam</li>
            </ul>
            <ul className="space-y-2">
              <li>• krachttraining amsterdam</li>
              <li>• houding verbeteren training</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Zoek je dit? Vul het formulier in en start gratis.</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Vind jouw personal trainer in Amsterdam
              </CardTitle>
              <CardDescription className="text-center">
                Gratis en vrijblijvend. Wij vinden trainers die bij jou passen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResult?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Bedankt!</h3>
                  <p className="text-gray-600">{submitResult.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Naam</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mailadres</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" onClick={nextStep}>
                          Volgende
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal">Doel</Label>
                        <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer je doel" />
                          </SelectTrigger>
                          <SelectContent>
                            {goals.map((goal) => (
                              <SelectItem key={goal} value={goal}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="district">Stadsdeel</Label>
                        <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer je stadsdeel" />
                          </SelectTrigger>
                          <SelectContent>
                            {amsterdamDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="startDate">Wanneer wil je starten?</Label>
                        <Input
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          placeholder="Bijvoorbeeld: volgende week, over een maand..."
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Terug
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Volgende
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Bericht (optioneel)</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Vertel ons meer over je doelen of wensen..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Terug
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Verzenden...' : 'Verzenden'}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {submitResult && !submitResult.success && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{submitResult.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
