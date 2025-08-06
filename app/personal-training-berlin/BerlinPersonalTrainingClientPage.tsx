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

export default function BerlinPersonalTrainingClientPage() {
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

  const berlinDistricts = [
    'Mitte', 'Friedrichshain-Kreuzberg', 'Pankow', 'Charlottenburg-Wilmersdorf',
    'Spandau', 'Steglitz-Zehlendorf', 'Tempelhof-Schöneberg', 'Neukölln',
    'Treptow-Köpenick', 'Marzahn-Hellersdorf', 'Lichtenberg', 'Reinickendorf'
  ]

  const goals = [
    'Gesundheit',
    'Muskelaufbau', 
    'Haltung',
    'Gewicht'
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
      const response = await fetch('/api/debug-berlin-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city: 'Berlin',
          timestamp: new Date().toISOString(),
          source: 'berlin-landing-page'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Perfekt! Wir melden uns innerhalb von 24 Stunden bei dir mit passenden Trainer*innen-Vorschlägen.'
        })
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitResult({
        success: false,
        message: 'Es gab einen Fehler beim Senden. Bitte versuche es erneut oder kontaktiere uns direkt.'
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
              <h3 className="text-xl font-semibold mb-2">Wie heißt du?</h3>
              <p className="text-gray-600">Damit wir dich persönlich ansprechen können</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Dein Vorname"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="deine@email.de"
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
              <h3 className="text-xl font-semibold mb-2">Was ist dein Hauptziel?</h3>
              <p className="text-gray-600">Damit wir die richtigen Trainer*innen für dich finden</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">Ziel</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Wähle dein Hauptziel" />
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
                <Label htmlFor="district">Bezirk</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="In welchem Bezirk suchst du?" />
                  </SelectTrigger>
                  <SelectContent>
                    {berlinDistricts.map((district) => (
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
              <h3 className="text-xl font-semibold mb-2">Wann möchtest du starten?</h3>
              <p className="text-gray-600">Und gibt es noch etwas, was wir wissen sollten?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Wunschtermin</Label>
                <Input
                  id="startDate"
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="z.B. nächste Woche, ab sofort, in 2 Wochen..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Nachricht (optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Erzähl uns mehr über deine Ziele oder Wünsche..."
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
              <h3 className="text-xl font-semibold mb-2">Fast geschafft!</h3>
              <p className="text-gray-600">Überprüfe deine Angaben und sende das Formular ab</p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>E-Mail:</strong> {formData.email}</p>
                <p><strong>Ziel:</strong> {formData.goal}</p>
                <p><strong>Bezirk:</strong> {formData.district}</p>
                <p><strong>Start:</strong> {formData.startDate}</p>
                {formData.message && <p><strong>Nachricht:</strong> {formData.message}</p>}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vielen Dank!</h1>
            <p className="text-lg text-gray-600 mb-8">{submitResult.message}</p>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Was passiert als nächstes?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ Wir analysieren dein Profil</li>
                <li>✓ Wir wählen 2 passende Trainer*innen aus</li>
                <li>✓ Du erhältst eine E-Mail mit den Kontaktdaten</li>
                <li>✓ Du kannst direkt Termine vereinbaren</li>
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
              Personal Training in Berlin
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Dein Coach wartet
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🟢 Start leicht gemacht</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ob du gerade erst anfängst oder im Gym feststeckst: In Berlin findest du Trainer*innen, die wissen, wie man Fortschritte macht. Kein Schnickschnack. Nur echte Hilfe.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Gratis Probetraining oder Video-Call</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>App downloaden: Wenn du lieber erstmal schauen willst</span>
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🪑 Zu viel Sitzen? Kein Plan vom Training?</h3>
                <p className="text-gray-600 mb-6">
                  Viele Leute in Berlin wollen gesünder werden, wissen aber nicht wie.
                </p>
                <p className="text-gray-600 mb-6">
                  Deshalb arbeiten unsere Trainer*innen mit Einsteiger*innen. Egal ob du Rückenschmerzen hast, Gewicht verlieren willst oder einfach besser schlafen möchtest.
                </p>
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">Angebote:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Kostenloses Probetraining in einem Studio</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Online-Beratung mit einem Coach</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Training mit Fokus auf Alltag und Beweglichkeit</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Trag dich ein – wir schlagen dir zwei passende Trainer*innen vor.
                  </p>
                </div>
              </div>

              {/* Advanced */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🏋️‍♂️ Du willst mehr Progress?</h3>
                <p className="text-gray-600 mb-6">
                  Berliner Lifter, die im Plateau hängen, finden hier Coaches mit Plan:
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Fortschrittsfokus (Overload, Reps, Intensität)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Personalisiertes Programming</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">App-Tracking und Feedback</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Wissen über moderne Methoden</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Ziele:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Muskelaufbau</li>
                      <li>• Performance</li>
                      <li>• Strukturiertes Hypertrophietraining</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Optionen:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Analysegespräch gratis</li>
                      <li>• Erste Session rückerstattet bei Buchung</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Jetzt Formular ausfüllen und durchstarten.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📱 App first?</h2>
            <p className="text-xl text-gray-600 mb-8">
              App holen. Profile checken. Interesse zeigen. Loslegen, wenn du bereit bist.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              App downloaden
            </Button>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trainer*innen aus Berlin</h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-lg text-gray-600 mb-6">
                Nur lokale Coaches aus Berlin – du kannst filtern nach:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Bezirk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Indoor, Outdoor oder Home Training</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Spezialisierung und Erfahrung</span>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Beliebte Suchbegriffe</h2>
            <p className="text-lg text-gray-600 mb-6">Wir erscheinen für:</p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg">personal trainer berlin</div>
              <div className="bg-white p-4 rounded-lg">fitnesscoach berlin</div>
              <div className="bg-white p-4 rounded-lg">probetraining berlin</div>
              <div className="bg-white p-4 rounded-lg">rückentraining berlin</div>
              <div className="bg-white p-4 rounded-lg">muskelaufbau berlin</div>
            </div>
            <p className="text-lg text-gray-600">
              Suchst du das? Trag dich ein – kostenlos.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Finde deinen Trainer</h2>
              <p className="text-lg text-gray-600">
                Gratis und unverbindlich. Wir finden Trainer*innen, die zu dir passen.
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
                      <span>Zurück</span>
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
                        Weiter
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
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
