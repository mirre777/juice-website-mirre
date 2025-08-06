'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Target } from 'lucide-react'

export default function BerlinPersonalTrainingClientPage() {
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
            Personal Training Berlin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Dein Coach wartet
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Start leicht gemacht
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Ob Anfänger oder im Gym feststeckst - in Berlin findest du Trainer*innen, die wissen, wie man Fortschritte macht. Kein Schnickschnack. Nur echte Hilfe.
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
                    Wenn du lieber erstmal schauen willst
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
                  Zu viel Sitzen? Kein Plan vom Training?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Viele Leute in Berlin wollen gesünder werden, wissen aber nicht wie.
              </p>
              
              <p className="text-gray-700 mb-6">
                Deshalb arbeiten unsere Trainer*innen mit Einsteiger*innen. Egal ob du Rückenschmerzen hast, Gewicht verlieren willst oder einfach besser schlafen möchtest.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Kostenloses Probetraining in einem Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Online-Beratung mit einem Coach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Training mit Fokus auf Alltag und Beweglichkeit</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Trag dich ein – wir schlagen dir zwei passende Trainer*innen vor.
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
                  Du willst mehr Progress?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Berliner Lifter, die im Plateau hängen, finden hier Coaches mit Plan:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Fortschrittsfokus (Overload, Reps, Intensität)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Personalisiertes Programming</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">App-Tracking und Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Wissen über moderne Methoden</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Ziele:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Muskelaufbau</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Performance</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Strukturiertes Hypertrophietraining</span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  Jetzt Formular ausfüllen und durchstarten.
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
                App first?
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              App holen. Profile checken. Interesse zeigen. Loslegen, wenn du bereit bist.
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
                Trainer*innen aus Berlin
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Nur lokale Coaches aus Berlin – du kannst filtern nach:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Bezirk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Indoor, Outdoor oder Home Training</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Spezialisierung und Erfahrung</span>
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
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">personal trainer berlin</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">fitnesscoach berlin</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">probetraining berlin</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">rückentraining berlin</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">muskelaufbau berlin</span>
            </div>
            
            <p className="text-gray-700">
              Suchst du das? Trag dich ein – kostenlos.
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Finde deinen Trainer
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
                    <SelectValue placeholder="Wähle dein Hauptziel" />
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
                <Label htmlFor="district">Bezirk</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="In welchem Bezirk suchst du?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mitte">Mitte</SelectItem>
                    <SelectItem value="friedrichshain-kreuzberg">Friedrichshain-Kreuzberg</SelectItem>
                    <SelectItem value="pankow">Pankow</SelectItem>
                    <SelectItem value="charlottenburg-wilmersdorf">Charlottenburg-Wilmersdorf</SelectItem>
                    <SelectItem value="spandau">Spandau</SelectItem>
                    <SelectItem value="steglitz-zehlendorf">Steglitz-Zehlendorf</SelectItem>
                    <SelectItem value="tempelhof-schöneberg">Tempelhof-Schöneberg</SelectItem>
                    <SelectItem value="neukölln">Neukölln</SelectItem>
                    <SelectItem value="treptow-köpenick">Treptow-Köpenick</SelectItem>
                    <SelectItem value="marzahn-hellersdorf">Marzahn-Hellersdorf</SelectItem>
                    <SelectItem value="lichtenberg">Lichtenberg</SelectItem>
                    <SelectItem value="reinickendorf">Reinickendorf</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="startTime">Wann möchtest du starten?</Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle deinen Wunschtermin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sofort">Sofort</SelectItem>
                    <SelectItem value="diese-woche">Diese Woche</SelectItem>
                    <SelectItem value="nächste-woche">Nächste Woche</SelectItem>
                    <SelectItem value="diesen-monat">Diesen Monat</SelectItem>
                    <SelectItem value="nächsten-monat">Nächsten Monat</SelectItem>
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
                  placeholder="Erzähl uns mehr über deine Ziele oder Wünsche..."
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
