'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, ArrowLeft, Smartphone, Users, Target, Calendar } from 'lucide-react'

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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    goal: '',
    district: '',
    startDate: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const copenhagenDistricts = [
    'Indre By', 'Vesterbro', 'Nørrebro', 'Østerbro', 'Frederiksberg', 
    'Amager Øst', 'Amager Vest', 'Vanløse', 'Brønshøj', 'Bispebjerg'
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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
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
          timestamp: new Date().toISOString(),
          source: 'copenhagen-landing-page'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Perfekt! Vi kontakter dig inden for 24 timer med passende træner-forslag.'
        })
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitResult({
        success: false,
        message: 'Der opstod en fejl ved afsendelse. Prøv igen eller kontakt os direkte.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hvad hedder du?</h3>
              <p className="text-gray-600">Så vi kan henvende os personligt</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Navn</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Dit fornavn"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="din@email.dk"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hvad er dit hovedmål?</h3>
              <p className="text-gray-600">Så vi kan finde de rigtige trænere til dig</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">Mål</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Vælg dit hovedmål" />
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
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Hvilken bydel søger du i?" />
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
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hvornår vil du starte?</h3>
              <p className="text-gray-600">Og er der noget andet, vi skal vide?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Startdato</Label>
                <Input
                  id="startDate"
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="f.eks. næste uge, med det samme, om 2 uger..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Besked (valgfri)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Fortæl os mere om dine mål eller ønsker..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Næsten færdig!</h3>
              <p className="text-gray-600">Tjek dine oplysninger og send formularen</p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p><strong>Navn:</strong> {formData.name}</p>
                <p><strong>E-mail:</strong> {formData.email}</p>
                <p><strong>Mål:</strong> {formData.goal}</p>
                <p><strong>Bydel:</strong> {formData.district}</p>
                <p><strong>Start:</strong> {formData.startDate}</p>
                {formData.message && <p><strong>Besked:</strong> {formData.message}</p>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tak!</h1>
            <p className="text-lg text-gray-600 mb-8">{submitResult.message}</p>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Hvad sker der nu?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ Vi analyserer din profil</li>
                <li>✓ Vi udvælger 2 passende trænere</li>
                <li>✓ Du modtager en e-mail med kontaktoplysninger</li>
                <li>✓ Du kan aftale tid direkte</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Personlig træning i København
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Find din træner
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">✅ Kom i gang uden bøvl</h2>
              <p className="text-lg text-gray-600 mb-6">
                Vil du bare i bedre form eller bryde igennem din træningsvæg? Vi har trænere i København, der ved hvordan.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Gratis prøvetime eller videosamtale</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Download appen, hvis du vil vente og kigge først</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Beginners */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🙋 Første gang i fitness?</h3>
                <p className="text-gray-600 mb-6">
                  Du behøver ikke kende øvelserne eller have udstyret i orden. Mange københavnske trænere arbejder med folk, der vil i gang – uden pres.
                </p>
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">Du får fx:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Gratis prøvetime i et lokalt træningscenter</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Online intro med en personlig træner</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Fokus på mobilitet, hverdagsstyrke og sundhed</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Udfyld formularen, så matcher vi dig med 2 trænere, der passer til dig.
                  </p>
                </div>
              </div>

              {/* Advanced */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🏋️ Seriøs omkring din træning?</h3>
                <p className="text-gray-600 mb-6">
                  København er fyldt med trænere, der kan hjælpe dig forbi plateauer og give dig et system:
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Program med progressive overload</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Tydelig plan og feedback i appen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Fokus på hypertrofi, styrke og performance</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Mål:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Muskelmasse</li>
                      <li>• Max styrke</li>
                      <li>• Avancerede splits og periodisering</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Muligheder:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Gratis samtale</li>
                      <li>• Første session refunderes hvis du booker</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Find din træner nu – bare udfyld formularen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Smartphone className="mx-auto h-12 w-12 text-green-600 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📱 Brug appen først?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Tjek profiler. Se hvem der er aktiv. Marker interesse. Start når du er klar.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Download appen
            </Button>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trænere i København</h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-lg text-gray-600 mb-6">
                Du ser kun trænere, der er aktive i København. Filtrer efter:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Bydel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Træningsform (center, udendørs, hjemme)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Speciale og erfaring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Populære søgeord</h2>
            <p className="text-lg text-gray-600 mb-6">Vi rangerer på:</p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg">personlig træner københavn</div>
              <div className="bg-white p-4 rounded-lg">gratis prøvetime træning københavn</div>
              <div className="bg-white p-4 rounded-lg">fitness coach københavn</div>
              <div className="bg-white p-4 rounded-lg">træning for begyndere københavn</div>
              <div className="bg-white p-4 rounded-lg">muskelopbygning københavn</div>
            </div>
            <p className="text-lg text-gray-600">
              Lyder det som dig? Så meld dig til gratis.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find din træner</h2>
              <p className="text-lg text-gray-600">
                Gratis og uforpligtende. Vi finder trænere, der passer til dig.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                {renderStep()}

                {submitResult && !submitResult.success && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{submitResult.message}</p>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Tilbage</span>
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 4 ? (
                      <Button
                        onClick={handleNext}
                        disabled={
                          (currentStep === 1 && (!formData.name || !formData.email)) ||
                          (currentStep === 2 && (!formData.goal || !formData.district)) ||
                          (currentStep === 3 && !formData.startDate)
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Næste
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? 'Sender...' : 'Send'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          step <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
