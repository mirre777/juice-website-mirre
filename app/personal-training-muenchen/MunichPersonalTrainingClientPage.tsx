'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Clock, Target } from 'lucide-react'

export default function MunichPersonalTrainingClientPage() {
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
            Personal Training München
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Finde deinen passenden Coach
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Start ohne Gedöns
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Neu im Gym? Oder schon ewig dabei, aber keine Fortschritte? In München 
              findest du Personal Trainer, die wissen, was funktioniert.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Gratis Probetraining oder Video-Call
                  </h3>
                  <p className="text-gray-600">
                    Viele Coaches bieten das direkt an
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    App downloaden
                  </h3>
                  <p className="text-gray-600">
                    Wenn du noch nicht bereit bist, aber wissen willst, wer in deiner Nähe ist
                  </p>
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
                Viele Münchner Trainer arbeiten mit Anfängern. Sie zeigen dir Basics, 
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
                  Füll das kurze Formular aus und wir verbinden dich mit 2 Trainern, die zu dir passen.
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
                Fortgeschrittene Kraftsportler in München finden hier Coaches, die wirklich liefern:
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
                <h4 className="font-semibold text-gray-900 mb-3">Wähle einen Trainer, der zu deinem Ziel passt:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Muskelaufbau</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Powerlifting</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Hypertrophie-Splits</span>
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
                Lokale Trainer in München
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Unsere Plattform zeigt dir nur aktive Coaches in München.
            </p>
            
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
          </CardContent>
        </Card>

        {/* SEO Keywords Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Beliebte Suchbegriffe
            </h3>
            
            <p className="text-gray-700 mb-4">Wir erscheinen für:</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">personal trainer münchen</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">fitnesscoach münchen</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">probetraining münchen</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">training mit rückenproblemen</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">muskelaufbau münchen</span>
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
              Finde deinen Personal Trainer in München
            </h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-Mail *</Label>
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
                <Label htmlFor="goal">Ziel *</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle dein Ziel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gesundheit">Gesundheit & Wohlbefinden</SelectItem>
                    <SelectItem value="muskelaufbau">Muskelaufbau</SelectItem>
                    <SelectItem value="gewicht">Gewicht verlieren</SelectItem>
                    <SelectItem value="haltung">Haltung verbessern</SelectItem>
                    <SelectItem value="kraft">Kraft & Ausdauer</SelectItem>
                    <SelectItem value="sport">Sportspezifisches Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">Stadtteil</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle deinen Stadtteil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="altstadt">Altstadt-Lehel</SelectItem>
                    <SelectItem value="ludwigsvorstadt">Ludwigsvorstadt-Isarvorstadt</SelectItem>
                    <SelectItem value="maxvorstadt">Maxvorstadt</SelectItem>
                    <SelectItem value="schwabing-west">Schwabing-West</SelectItem>
                    <SelectItem value="au-haidhausen">Au-Haidhausen</SelectItem>
                    <SelectItem value="sendling">Sendling</SelectItem>
                    <SelectItem value="sendling-westpark">Sendling-Westpark</SelectItem>
                    <SelectItem value="schwanthalerhoehe">Schwanthalerhöhe</SelectItem>
                    <SelectItem value="neuhausen">Neuhausen-Nymphenburg</SelectItem>
                    <SelectItem value="moosach">Moosach</SelectItem>
                    <SelectItem value="milbertshofen">Milbertshofen-Am Hart</SelectItem>
                    <SelectItem value="schwabing-freimann">Schwabing-Freimann</SelectItem>
                    <SelectItem value="bogenhausen">Bogenhausen</SelectItem>
                    <SelectItem value="berg-am-laim">Berg am Laim</SelectItem>
                    <SelectItem value="trudering">Trudering-Riem</SelectItem>
                    <SelectItem value="ramersdorf">Ramersdorf-Perlach</SelectItem>
                    <SelectItem value="obergiesing">Obergiesing-Fasangarten</SelectItem>
                    <SelectItem value="untergiesing">Untergiesing-Harlaching</SelectItem>
                    <SelectItem value="thalkirchen">Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln</SelectItem>
                    <SelectItem value="hadern">Hadern</SelectItem>
                    <SelectItem value="pasing">Pasing-Obermenzing</SelectItem>
                    <SelectItem value="aubing">Aubing-Lochhausen-Langwied</SelectItem>
                    <SelectItem value="allach">Allach-Untermenzing</SelectItem>
                    <SelectItem value="feldmoching">Feldmoching-Hasenbergl</SelectItem>
                    <SelectItem value="laim">Laim</SelectItem>
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
                  placeholder="Erzähl uns mehr über deine Ziele oder besonderen Anforderungen..."
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Trainer finden'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
