'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Target } from 'lucide-react'

export default function AmsterdamPersonalTrainingClientPage() {
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
      setSubmitMessage('Bedankt! We nemen binnenkort contact met je op.')
      setFormData({ name: '', email: '', goal: '', district: '', startTime: '', message: '' })
    } catch (error) {
      setSubmitMessage('Fout bij verzenden. Probeer het opnieuw.')
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
            Personal training in Amsterdam
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vind jouw trainer
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Start zonder gedoe
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Nieuw in de gym? Of al even bezig maar geen progressie? In Amsterdam 
              vind je personal trainers die snappen wat werkt.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Gratis proefles of videogesprek
                  </h3>
                  <p className="text-gray-600">
                    Veel coaches bieden dit direct aan
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
                    Als je eerst wilt rondkijken
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
                  Eerste stap naar gezonder leven?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Geen stress. Veel trainers in Amsterdam werken met mensen die willen starten, maar niet weten hoe.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Gratis proefles in een studio of gym</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Online kennismaking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Training gericht op houding, beweging en basisconditie</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Vul het formulier in. Wij koppelen je aan 2 trainers die bij jou passen.
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
                  Kracht, progressie, structuur?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Serieus bezig met krachttraining maar vastgelopen? Amsterdamse coaches kunnen je programmeren, tracken en begeleiden:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Persoonlijk plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Progressive overload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">App tracking & feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Kennis van hypertrofie & lifting</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Doelen:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Spiermassa</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Structuur</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Resultaat</span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  Vul het formulier in en krijg een coach die levert.
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
                Nog niet klaar om te starten?
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Download de app. Bekijk profielen. Toon interesse. Start wanneer jij wilt.
            </p>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              Download de app
            </Button>
          </CardContent>
        </Card>

        {/* Local Trainers Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Trainers in Amsterdam
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              We tonen alleen actieve trainers in Amsterdam. Je kunt filteren op:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Stadsdeel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Trainingsvorm (studio, thuis, buiten)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Specialisaties</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Keywords Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Populaire zoektermen
            </h3>
            
            <p className="text-gray-700 mb-4">We scoren op:</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">personal trainer amsterdam</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">gratis proefles personal trainer</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">fitness begeleiding amsterdam</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">krachttraining amsterdam</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">houding verbeteren training</span>
            </div>
            
            <p className="text-gray-700">
              Zoek je dit? Vul het formulier in en start gratis.
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Vind jouw trainer
            </h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mailadres *</Label>
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
                <Label htmlFor="goal">Doel *</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kies je hoofddoel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gezondheid">Gezondheid</SelectItem>
                    <SelectItem value="spiermassa">Spiermassa</SelectItem>
                    <SelectItem value="afvallen">Afvallen</SelectItem>
                    <SelectItem value="houding">Houding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">Stadsdeel</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="In welk stadsdeel zoek je?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centrum">Centrum</SelectItem>
                    <SelectItem value="noord">Noord</SelectItem>
                    <SelectItem value="oost">Oost</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="zuid">Zuid</SelectItem>
                    <SelectItem value="zuidoost">Zuidoost</SelectItem>
                    <SelectItem value="nieuw-west">Nieuw-West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="startTime">Wanneer wil je starten?</Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kies je startmoment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="deze-week">Deze week</SelectItem>
                    <SelectItem value="volgende-week">Volgende week</SelectItem>
                    <SelectItem value="deze-maand">Deze maand</SelectItem>
                    <SelectItem value="volgende-maand">Volgende maand</SelectItem>
                    <SelectItem value="flexibel">Ben flexibel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verzenden...' : 'Verzenden'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
