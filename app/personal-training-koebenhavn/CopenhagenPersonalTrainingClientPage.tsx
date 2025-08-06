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

export default function CopenhagenPersonalTrainingClientPage() {
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

  const copenhagenDistricts = [
    'Indre By',
    'Vesterbro',
    'Nørrebro',
    'Østerbro',
    'Frederiksberg',
    'Amager',
    'Valby',
    'Vanløse'
  ]

  const goals = [
    'Sundhed',
    'Muskelopbygning', 
    'Holdning',
    'Vægttab'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/debug-copenhagen-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city: 'Copenhagen',
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Tak! Vi kontakter dig inden for 24 timer for at matche dig med 2 egnede trænere i København.'
        })
        setCurrentStep(4)
      } else {
        throw new Error(result.error || 'Der skete en fejl')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitResult({
        success: false,
        message: 'Der opstod en fejl. Prøv igen eller kontakt os.'
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
            Personlig træning i København
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Find din træner
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <CheckCircle className="text-green-500 mr-2" />
              Kom i gang uden bøvl
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Vil du bare i bedre form eller bryde igennem din træningsvæg? Vi har trænere i København, der ved hvordan.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Gratis prøvetime eller videosamtale</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="text-blue-500 mr-2 flex-shrink-0" />
                <span>Download appen, hvis du vil vente og kigge først</span>
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
              🙋 Første gang i fitness?
            </h2>
            <p className="text-xl text-gray-600">
              Du behøver ikke kende øvelserne eller have udstyret i orden. Mange københavnske trænere arbejder med folk, der vil i gang – uden pres.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Du får fx:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Gratis prøvetime i et lokalt træningscenter</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Online intro med en personlig træner</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Fokus på mobilitet, hverdagsstyrke og sundhed</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-lg font-medium text-center">
                Udfyld formularen, så matcher vi dig med 2 trænere, der passer til dig.
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
              🏋️ Seriøs omkring din træning?
            </h2>
            <p className="text-xl text-gray-600">
              København er fyldt med trænere, der kan hjælpe dig forbi plateauer og give dig et system:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Program med progressive overload</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Tydelig plan og feedback i appen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Fokus på hypertrofi, styrke og performance</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Mål:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Muskelmasse</span>
                </li>
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Max styrke</span>
                </li>
                <li className="flex items-center">
                  <Target className="text-blue-500 mr-2 flex-shrink-0" />
                  <span>Avancerede splits og periodisering</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Muligheder:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Gratis samtale</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Første session refunderes hvis du booker</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-lg font-medium">
                Find din træner nu – bare udfyld formularen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            📱 Brug appen først?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tjek profiler. Se hvem der er aktiv. Marker interesse. Start når du er klar.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Download appen
          </Button>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Trænere i København</h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Du ser kun trænere, der er aktive i København. Filtrer efter:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-center">
              <MapPin className="text-blue-500 mr-2" />
              <span>Bydel</span>
            </div>
            <div className="flex items-center justify-center">
              <Users className="text-green-500 mr-2" />
              <span>Træningsform (center, udendørs, hjemme)</span>
            </div>
            <div className="flex items-center justify-center">
              <Target className="text-purple-500 mr-2" />
              <span>Speciale og erfaring</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Populære søgeord</h2>
          <p className="text-lg text-gray-600 text-center mb-8">Vi rangerer på:</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <ul className="space-y-2">
              <li>• personlig træner københavn</li>
              <li>• gratis prøvetime træning københavn</li>
              <li>• fitness coach københavn</li>
            </ul>
            <ul className="space-y-2">
              <li>• træning for begyndere københavn</li>
              <li>• muskelopbygning københavn</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Lyder det som dig? Så meld dig til gratis.</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Find din personlige træner i København
              </CardTitle>
              <CardDescription className="text-center">
                Gratis og uforpligtende. Vi finder trænere, der passer til dig.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResult?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Tak!</h3>
                  <p className="text-gray-600">{submitResult.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Navn</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
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
                          Næste
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal">Mål</Label>
                        <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vælg dit mål" />
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
                        <Label htmlFor="district">Bydel</Label>
                        <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vælg din bydel" />
                          </SelectTrigger>
                          <SelectContent>
                            {copenhagenDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="startDate">Startdato</Label>
                        <Input
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          placeholder="For eksempel: næste uge, om en måned..."
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Tilbage
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Næste
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Besked (valgfrit)</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Fortæl os mere om dine mål eller ønsker..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Tilbage
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Sender...' : 'Send'}
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
