'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Download, MapPin, Target } from 'lucide-react'

export default function CopenhagenPersonalTrainingClientPage() {
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
      setSubmitMessage('Tak! Vi kontakter dig snart.')
      setFormData({ name: '', email: '', goal: '', district: '', startTime: '', message: '' })
    } catch (error) {
      setSubmitMessage('Fejl ved afsendelse. Prøv igen.')
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
            Personlig træning i København
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find din træner
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Kom i gang uden bøvl
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Vil du bare i bedre form eller bryde igennem din træningsvæg? Vi har trænere i København, der ved hvordan.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Gratis prøvetime eller videosamtale
                  </h3>
                  <p className="text-gray-600">
                    Mange coaches tilbyder dette direkte
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Download appen
                  </h3>
                  <p className="text-gray-600">
                    Hvis du vil vente og kigge først
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
                  Første gang i fitness?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Du behøver ikke kende øvelserne eller have udstyret i orden. Mange københavnske trænere arbejder med folk, der vil i gang – uden pres.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Gratis prøvetime i et lokalt træningscenter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Online intro med en personlig træner</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Fokus på mobilitet, hverdagsstyrke og sundhed</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Udfyld formularen, så matcher vi dig med 2 trænere, der passer til dig.
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
                  Seriøs omkring din træning?
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                København er fyldt med trænere, der kan hjælpe dig forbi plateauer og give dig et system:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Program med progressive overload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Tydelig plan og feedback i appen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Fokus på hypertrofi, styrke og performance</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Mål:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Muskelmasse</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Max styrke</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Avancerede splits</span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  Find din træner nu – bare udfyld formularen.
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
                Brug appen først?
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tjek profiler. Se hvem der er aktiv. Marker interesse. Start når du er klar.
            </p>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              Download appen
            </Button>
          </CardContent>
        </Card>

        {/* Local Trainers Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Trænere i København
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Du ser kun trænere, der er aktive i København. Filtrer efter:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Bydel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Træningsform (center, udendørs, hjemme)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Speciale og erfaring</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Keywords Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Populære søgeord
            </h3>
            
            <p className="text-gray-700 mb-4">Vi rangerer på:</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">personlig træner københavn</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">gratis prøvetime træning københavn</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">fitness coach københavn</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">træning for begyndere københavn</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">muskelopbygning københavn</span>
            </div>
            
            <p className="text-gray-700">
              Lyder det som dig? Så meld dig til gratis.
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Find din træner
            </h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Navn *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
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
                <Label htmlFor="goal">Mål *</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vælg dit hovedmål" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sundhed">Sundhed</SelectItem>
                    <SelectItem value="muskelopbygning">Muskelopbygning</SelectItem>
                    <SelectItem value="vægttab">Vægttab</SelectItem>
                    <SelectItem value="holdning">Holdning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">Bydel</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Hvilken bydel søger du i?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indre-by">Indre By</SelectItem>
                    <SelectItem value="vesterbro">Vesterbro</SelectItem>
                    <SelectItem value="nørrebro">Nørrebro</SelectItem>
                    <SelectItem value="østerbro">Østerbro</SelectItem>
                    <SelectItem value="frederiksberg">Frederiksberg</SelectItem>
                    <SelectItem value="amager-øst">Amager Øst</SelectItem>
                    <SelectItem value="amager-vest">Amager Vest</SelectItem>
                    <SelectItem value="vanløse">Vanløse</SelectItem>
                    <SelectItem value="brønshøj">Brønshøj</SelectItem>
                    <SelectItem value="bispebjerg">Bispebjerg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="startTime">Hvornår vil du starte?</Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vælg dit starttidspunkt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="med-det-samme">Med det samme</SelectItem>
                    <SelectItem value="denne-uge">Denne uge</SelectItem>
                    <SelectItem value="næste-uge">Næste uge</SelectItem>
                    <SelectItem value="denne-måned">Denne måned</SelectItem>
                    <SelectItem value="næste-måned">Næste måned</SelectItem>
                    <SelectItem value="flexibel">Er flexibel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Besked (valgfri)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Fortæl os mere om dine mål eller ønsker..."
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sender...' : 'Send'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
