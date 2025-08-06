'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Users, Target, Calendar, MapPin, Smartphone, Dumbbell, Heart } from 'lucide-react'

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
  'Gesundheit & Wohlbefinden',
  'Muskelaufbau',
  'Gewicht verlieren', 
  'Haltung verbessern',
  'Kraftaufbau',
  'Beweglichkeit',
  'Rückenprobleme lösen'
]

export default function ViennaPersonalTrainingClientPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    district: '',
    startDate: '',
    experience: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
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

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfekt!</h2>
            <p className="text-gray-600 mb-4">
              Wir haben deine Anfrage erhalten und werden dir innerhalb von 24 Stunden 2 passende Trainer*innen aus Wien vorschlagen.
            </p>
            <p className="text-sm text-gray-500">
              Check deine E-Mails - manchmal landen wir im Spam-Ordner.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal Training in Wien
            <span className="block text-green-600">Finde deinen Coach</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ob du fitter werden willst, ohne Plan ins Gym gehst oder endlich dein Plateau sprengen willst – hier findest du Personal Trainer*innen in Wien, die dich wirklich weiterbringen.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Target className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Gratis Probetraining</h3>
              <p className="text-gray-600 text-sm">Einige Coaches bieten das direkt an</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Smartphone className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">App downloaden</h3>
              <p className="text-gray-600 text-sm">Wenn du noch nicht bereit bist, aber wissen willst, wer in deiner Nähe ist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beginner Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Du willst dich einfach besser fühlen?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Du sitzt viel? Dein Rücken zwickt? Du willst mehr Energie? Viele Wiener Trainer*innen arbeiten mit Anfänger*innen. Sie zeigen dir Basics, helfen bei der Haltung und machen dir den Einstieg leicht.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Kostenloses Probetraining</h3>
              <p className="text-gray-600 text-sm">in einem Studio</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Online-Erstgespräch</h3>
              <p className="text-gray-600 text-sm">mit einem Coach</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Fokus auf Gesundheit</h3>
              <p className="text-gray-600 text-sm">Beweglichkeit, Alltag und Gesundheit</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-4">
              Füll das kurze Formular aus und wir verbinden dich mit 2 Trainer*innen, die zu dir passen.
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Du bist ambitioniert, aber hängst fest?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fortgeschrittene Kraftsportler in Wien finden hier Coaches, die wirklich liefern
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Was du bekommst:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Fokus auf progressive Overload</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Programmdesign, das wirkt</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Fortschritts-Tracking in der App</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Wissen über neue Methoden & Recovery</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Spezialisierungen:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Target className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Muskelaufbau</span>
                </li>
                <li className="flex items-center">
                  <Target className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Powerlifting</span>
                </li>
                <li className="flex items-center">
                  <Target className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Hypertrophie-Splits</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-4">
              Füll das Formular aus und finde deinen Coach für echte Gains.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Finde deinen Personal Trainer in Wien
              </CardTitle>
              <div className="flex justify-center space-x-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Dein Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="deine@email.com"
                    />
                  </div>
                  <Button 
                    onClick={handleNext} 
                    className="w-full"
                    disabled={!formData.name || !formData.email}
                  >
                    Weiter
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal">Dein Hauptziel</Label>
                    <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle dein Ziel" />
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
                    <Label htmlFor="district">Bezirk in Wien</Label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle deinen Bezirk" />
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
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Zurück
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      className="flex-1"
                      disabled={!formData.goal || !formData.district}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startDate">Wann willst du starten?</Label>
                    <Select value={formData.startDate} onValueChange={(value) => handleInputChange('startDate', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle einen Zeitraum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sofort">Sofort</SelectItem>
                        <SelectItem value="diese-woche">Diese Woche</SelectItem>
                        <SelectItem value="naechste-woche">Nächste Woche</SelectItem>
                        <SelectItem value="diesen-monat">Diesen Monat</SelectItem>
                        <SelectItem value="naechsten-monat">Nächsten Monat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Zusätzliche Informationen (optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Erzähl uns mehr über deine Ziele oder besonderen Anforderungen..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Zurück
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="flex-1"
                      disabled={isSubmitting || !formData.startDate}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Trainer finden'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* App Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Smartphone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Noch nicht sicher?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Hol dir die App. Schau Trainerprofile durch, signalisiere dein Interesse und meld dich, wenn du bereit bist.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            App downloaden
          </Button>
        </div>
      </section>

      {/* Local Trainers Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lokale Trainer*innen in Wien
            </h2>
            <p className="text-lg text-gray-600">
              Unsere Plattform zeigt dir nur aktive Coaches in Wien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Nach Stadtteil</h3>
              <p className="text-gray-600 text-sm">Finde Trainer in deinem Bezirk</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Trainingsort</h3>
              <p className="text-gray-600 text-sm">Gym, Home oder Outdoor</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Spezialisierung</h3>
              <p className="text-gray-600 text-sm">Erfahrung & Expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Beliebte Suchbegriffe
          </h2>
          <p className="text-lg text-gray-600 mb-8">Wir erscheinen für:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              'personal trainer wien',
              'fitnesscoach wien', 
              'probetraining wien',
              'training mit rückenproblemen',
              'muskelaufbau wien'
            ].map((term) => (
              <span
                key={term}
                className="bg-white px-4 py-2 rounded-full text-gray-700 border"
              >
                {term}
              </span>
            ))}
          </div>
          <p className="text-lg font-medium text-gray-900">
            Du suchst genau das? Trag dich ein und starte gratis.
          </p>
        </div>
      </section>
    </div>
  )
}
