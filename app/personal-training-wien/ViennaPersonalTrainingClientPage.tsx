'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Target } from 'lucide-react'

export default function ViennaPersonalTrainingClientPage() {
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
      setSubmitMessage('Vielen Dank! Wir melden uns bald bei dir.')
      setFormData({ name: '', email: '', goal: '', district: '', startTime: '', message: '' })
    } catch (error) {
      setSubmitMessage('Fehler beim Senden. Bitte versuche es erneut.')
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
            Personal Training in Wien
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Finde deinen Coach
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Bereit für deinen ersten Schritt?
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Ob du fitter werden willst, ohne Plan ins Gym gehst oder endlich dein Plateau sprengen willst – hier
              findest du Personal Trainer*innen in Wien, die dich wirklich weiterbringen.
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Zwei Wege, loszulegen</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Gratis Probetraining oder Video-Call
                    </h4>
                    <p className="text-gray-600">
                      Einige Coaches bieten das direkt an
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      App downloaden
                    </h4>
                    <p className="text-gray-600">
                      Wenn du noch nicht bereit bist, aber wissen willst, wer in deiner Nähe ist
                    </p>
                  </div>
                </div>
              </div>
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
                  Du willst dich einfach besser fühlen?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Du sitzt viel? Dein Rücken zwickt? Du willst mehr Energie?
              </p>
              
              <p className="text-gray-700 mb-6">
                Viele Wiener Trainer*innen arbeiten mit Anfänger*innen. Sie zeigen dir Basics, 
                helfen bei der Haltung und machen dir den Einstieg leicht. Du brauchst 
                keine Vorkenntnisse. Einfach loslegen.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Kostenloses Probetraining in einem Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Online-Erstgespräch mit einem Coach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Einstieg mit Fokus auf Beweglichkeit, Alltag und Gesundheit</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Füll das kurze Formular aus und wir verbinden dich mit 2 Trainer*innen, die zu dir passen.
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
                  Du bist ambitioniert, aber hängst fest?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Fortgeschrittene Kraftsportler in Wien finden hier Coaches, die wirklich liefern:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Fokus auf progressive Overload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Programmdesign, das wirkt</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Fortschritts-Tracking in der App</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Wissen über neue Methoden & Recovery</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Wähle einen Trainer, der zu deinem Ziel passt</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Muskelaufbau</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Powerlifting</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Hypertrophie-Splits</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Kostenloses Analysegespräch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Geld-zurück bei Buchung nach dem ersten Training</span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  Füll das Formular aus und finde deinen Coach für echte Gains.
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
                Noch nicht sicher?
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Hol dir die App. Schau Trainerprofile durch, signalisiere dein Interesse 
              und meld dich, wenn du bereit bist.
            </p>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              App downloaden
            </Button>
          </CardContent>
        </Card>

        {/* Local Trainers Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Lokale Trainer*innen in Wien
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Unsere Plattform zeigt dir nur aktive Coaches in Wien.
            </p>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">Du kannst filtern nach:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Stadtteil</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Trainingsort (Gym, Home, Outdoor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Erfahrung & Spezialisierung</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Keywords Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Beliebte Suchbegriffe (SEO)
            </h3>
            
            <p className="text-gray-700 mb-4">Wir erscheinen für:</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">personal trainer wien</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">fitnesscoach wien</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">probetraining wien</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">training mit rückenproblemen</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">muskelaufbau wien</span>
            </div>
            
            <p className="text-gray-700">
              Du suchst genau das? Trag dich ein und starte gratis.
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Formular
            </h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name:</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-Mail:</Label>
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
                <Label htmlFor="goal">Ziel (Gesundheit / Muskelaufbau / Gewicht / Haltung):</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle dein Ziel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gesundheit">Gesundheit</SelectItem>
                    <SelectItem value="muskelaufbau">Muskelaufbau</SelectItem>
                    <SelectItem value="gewicht">Gewicht</SelectItem>
                    <SelectItem value="haltung">Haltung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">Ort (Bezirk):</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle deinen Bezirk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-innere-stadt">1. Innere Stadt</SelectItem>
                    <SelectItem value="2-leopoldstadt">2. Leopoldstadt</SelectItem>
                    <SelectItem value="3-landstrasse">3. Landstraße</SelectItem>
                    <SelectItem value="4-wieden">4. Wieden</SelectItem>
                    <SelectItem value="5-margareten">5. Margareten</SelectItem>
                    <SelectItem value="6-mariahilf">6. Mariahilf</SelectItem>
                    <SelectItem value="7-neubau">7. Neubau</SelectItem>
                    <SelectItem value="8-josefstadt">8. Josefstadt</SelectItem>
                    <SelectItem value="9-alsergrund">9. Alsergrund</SelectItem>
                    <SelectItem value="10-favoriten">10. Favoriten</SelectItem>
                    <SelectItem value="11-simmering">11. Simmering</SelectItem>
                    <SelectItem value="12-meidling">12. Meidling</SelectItem>
                    <SelectItem value="13-hietzing">13. Hietzing</SelectItem>
                    <SelectItem value="14-penzing">14. Penzing</SelectItem>
                    <SelectItem value="15-rudolfsheim-fuenfhaus">15. Rudolfsheim-Fünfhaus</SelectItem>
                    <SelectItem value="16-ottakring">16. Ottakring</SelectItem>
                    <SelectItem value="17-hernals">17. Hernals</SelectItem>
                    <SelectItem value="18-waehring">18. Währing</SelectItem>
                    <SelectItem value="19-doebling">19. Döbling</SelectItem>
                    <SelectItem value="20-brigittenau">20. Brigittenau</SelectItem>
                    <SelectItem value="21-floridsdorf">21. Floridsdorf</SelectItem>
                    <SelectItem value="22-donaustadt">22. Donaustadt</SelectItem>
                    <SelectItem value="23-liesing">23. Liesing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="startTime">Wann willst du starten?</Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle deinen Starttermin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sofort">Sofort</SelectItem>
                    <SelectItem value="diese-woche">Diese Woche</SelectItem>
                    <SelectItem value="naechste-woche">Nächste Woche</SelectItem>
                    <SelectItem value="diesen-monat">Diesen Monat</SelectItem>
                    <SelectItem value="naechsten-monat">Nächsten Monat</SelectItem>
                    <SelectItem value="flexibel">Bin flexibel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Nachricht (optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Erzähl uns mehr über deine Ziele..."
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
