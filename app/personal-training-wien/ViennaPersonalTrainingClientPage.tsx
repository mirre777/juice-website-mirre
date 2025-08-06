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

export default function ViennaPersonalTrainingClientPage() {
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

  const viennaDistricts = [
    '1. Innere Stadt',
    '2. Leopoldstadt', 
    '3. Landstraße',
    '4. Wieden',
    '5. Margareten',
    '6. Mariahilf',
    '7. Neubau',
    '8. Josefstadt',
    '9. Alsergrund',
    '10. Favoriten',
    '11. Simmering',
    '12. Meidling',
    '13. Hietzing',
    '14. Penzing',
    '15. Rudolfsheim-Fünfhaus',
    '16. Ottakring',
    '17. Hernals',
    '18. Währing',
    '19. Döbling',
    '20. Brigittenau',
    '21. Floridsdorf',
    '22. Donaustadt',
    '23. Liesing'
  ]

  const goals = [
    'Gesundheit',
    'Muskelaufbau', 
    'Gewicht',
    'Haltung'
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
      const response = await fetch('/api/debug-vienna-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city: 'Wien',
          timestamp: new Date().toISOString(),
          source: 'vienna-landing-page'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Perfekt! Wir melden uns innerhalb von 24 Stunden bei dir mit passenden Trainer*innen-Vorschlägen aus Wien.'
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
                  placeholder="deine@email.at"
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
                    {viennaDistricts.map((district) => (
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
              <h3 className="text-xl font-semibold mb-2">Wann willst du starten?</h3>
              <p className="text-gray-600">Und gibt es noch etwas, was wir wissen sollten?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Wann willst du starten?</Label>
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
                <li>✓ Wir wählen 2 passende Trainer*innen aus Wien aus</li>
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
              Personal Training in Wien
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Finde deinen Coach
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">✨ Bereit für deinen ersten Schritt?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ob du fitter werden willst, ohne Plan ins Gym gehst oder endlich dein Plateau sprengen willst – hier findest du Personal Trainer*innen in Wien, die dich wirklich weiterbringen.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Gratis Probetraining oder Video-Call: Einige Coaches bieten das direkt an</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>App downloaden: Wenn du noch nicht bereit bist, aber wissen willst, wer in deiner Nähe ist</span>
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🏋️ Du willst dich einfach besser fühlen?</h3>
                <p className="text-gray-600 mb-6">
                  Du sitzt viel? Dein Rücken zwickt? Du willst mehr Energie?
                </p>
                <p className="text-gray-600 mb-6">
                  Viele Wiener Trainer*innen arbeiten mit Anfänger*innen. Sie zeigen dir Basics, helfen bei der Haltung und machen dir den Einstieg leicht. Du brauchst keine Vorkenntnisse. Einfach loslegen.
                </p>
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">Möglichkeiten:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Kostenloses Probetraining in einem Studio</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Online-Erstgespräch mit einem Coach</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Einstieg mit Fokus auf Beweglichkeit, Alltag und Gesundheit</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Füll das kurze Formular aus und wir verbinden dich mit 2 Trainer*innen, die zu dir passen.
                  </p>
                </div>
              </div>

              {/* Advanced */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">📊 Du bist ambitioniert, aber hängst fest?</h3>
                <p className="text-gray-600 mb-6">
                  Fortgeschrittene Kraftsportler in Wien finden hier Coaches, die wirklich liefern:
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Fokus auf progressive Overload</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Programmdesign, das wirkt</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Fortschritts-Tracking in der App</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Wissen über neue Methoden & Recovery</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Wähle einen Trainer, der zu deinem Ziel passt:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Muskelaufbau</li>
                      <li>• Powerlifting</li>
                      <li>• Hypertrophie-Splits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Optionen:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Kostenloses Analysegespräch</li>
                      <li>• Geld-zurück bei Buchung nach dem ersten Training</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Füll das Formular aus und finde deinen Coach für echte Gains.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📱 Noch nicht sicher?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Hol dir die App. Schau Trainerprofile durch, signalisiere dein Interesse und meld dich, wenn du bereit bist.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lokale Trainer*innen in Wien</h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-lg text-gray-600 mb-6">
                Unsere Plattform zeigt dir nur aktive Coaches in Wien. Du kannst filtern nach:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Stadtteil</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Trainingsort (Gym, Home, Outdoor)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Erfahrung & Spezialisierung</span>
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
              <div className="bg-white p-4 rounded-lg">personal trainer wien</div>
              <div className="bg-white p-4 rounded-lg">fitnesscoach wien</div>
              <div className="bg-white p-4 rounded-lg">probetraining wien</div>
              <div className="bg-white p-4 rounded-lg">training mit rückenproblemen</div>
              <div className="bg-white p-4 rounded-lg">muskelaufbau wien</div>
            </div>
            <p className="text-lg text-gray-600">
              Du suchst genau das? Trag dich ein und starte gratis.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Finde deinen Coach</h2>
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
