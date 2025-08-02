"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle, MapPin, Users, Star, Download } from "lucide-react"
import { joinWaitlist } from "@/actions/waitlist-actions"

export default function MunichPersonalTrainingClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goal: "",
    district: "",
    startTime: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value)
    })
    formDataObj.append("user_type", "client")
    formDataObj.append("city", "München")
    formDataObj.append("plan", "personal-training-munich")

    try {
      const result = await joinWaitlist(formDataObj)
      setSubmitStatus(result)
      if (result.success) {
        setFormData({ name: "", email: "", goal: "", district: "", startTime: "", phone: "" })
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: "Etwas ist schiefgelaufen. Bitte versuche es erneut." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const districts = [
    "Altstadt-Lehel",
    "Ludwigsvorstadt-Isarvorstadt",
    "Maxvorstadt",
    "Schwabing-West",
    "Au-Haidhausen",
    "Sendling",
    "Sendling-Westpark",
    "Schwanthalerhöhe",
    "Neuhausen-Nymphenburg",
    "Moosach",
    "Milbertshofen-Am Hart",
    "Schwabing-Freimann",
    "Bogenhausen",
    "Berg am Laim",
    "Trudering-Riem",
    "Ramersdorf-Perlach",
    "Obergiesing-Fasangarten",
    "Untergiesing-Harlaching",
    "Thalkirchen-Obersendling-Forstenried-Fürstenried",
    "Hadern",
    "Pasing-Obermenzing",
    "Aubing-Lochhausen-Langwied",
    "Allach-Untermenzing",
    "Feldmoching-Hasenbergl",
    "Laim",
  ]

  const goals = [
    "Gesundheit & Wohlbefinden",
    "Muskelaufbau",
    "Haltung verbessern",
    "Abnehmen & Körperfett reduzieren",
    "Kraft & Leistung steigern",
    "Rücken stärken",
    "Einstieg ins Training",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal Training in <span className="text-blue-600">München</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">Der passende Coach für dich</p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's Trainer*innen, die dich verstehen
            und weiterbringen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <CheckCircle className="mr-2 h-5 w-5" />
              Gratis Probetraining
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              <Download className="mr-2 h-5 w-5" />
              App downloaden
            </Button>
          </div>
        </div>
      </section>

      {/* Target Audience Sections */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Beginners Section */}
            <Card className="p-8 border-2 border-green-200 bg-green-50">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🧍‍♂️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Keine Ahnung, wie du anfangen sollst?</h2>
                <p className="text-gray-700 mb-6">
                  Viele Leute in München wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen
                  halten sie ab. Unsere Coaches helfen beim Einstieg.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Kostenloses Probetraining</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Online-Beratung mit Fokus auf Gesundheit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Einstieg mit Bewegungsanalyse & Haltungstraining</span>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">Passende Trainer*innen finden</Button>
              </CardContent>
            </Card>

            {/* Advanced Section */}
            <Card className="p-8 border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🏋️‍♂️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Du trainierst hart, aber nichts passiert?</h2>
                <p className="text-gray-700 mb-6">
                  Wenn du in München ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Maßgeschneiderte Programme</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Fokus auf progressive Overload</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>App-Tracking und Analyse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Wissen zu Hypertrophie, Regeneration & Ernährung</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Badge variant="secondary">Muskelaufbau</Badge>
                  <Badge variant="secondary">Leistung</Badge>
                  <Badge variant="secondary">Technikanalyse</Badge>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">Jetzt Coach erhalten</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Willst du erst mal stöbern?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Hol dir die App. Klick dich durch Trainerprofile. Sag Bescheid, wenn du bereit bist.
          </p>
          <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
            <Download className="mr-2 h-5 w-5" />
            App downloaden
          </Button>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trainer*innen aus München</h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Wir zeigen nur aktive Coaches in München. Filter möglich nach:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Stadtteil</h3>
              <p className="text-sm text-gray-600">Trainer in deiner Nähe finden</p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Trainingsort</h3>
              <p className="text-sm text-gray-600">Studio, Outdoor, Home</p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Spezialisierung</h3>
              <p className="text-sm text-gray-600">Erfahrung & Expertise</p>
            </Card>
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Beliebte Suchbegriffe</h2>
          <p className="text-gray-600 mb-8">Wir ranken für:</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              personal trainer münchen
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              fitnesscoach münchen
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              probetraining münchen
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              rücken stärken training münchen
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              muskelaufbau trainer münchen
            </Badge>
          </div>
          <p className="text-lg font-medium text-gray-900">Das klingt nach dir? Dann trag dich ein.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Passenden Coach finden</h2>

              {submitStatus.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vielen Dank!</h3>
                  <p className="text-gray-600">{submitStatus.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="Dein Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="deine@email.de"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+49 123 456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goal">Ziel *</Label>
                    <Select value={formData.goal} onValueChange={(value) => handleInputChange("goal", value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="district">Stadtteil *</Label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle deinen Stadtteil" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startTime">Startzeitpunkt</Label>
                    <Select value={formData.startTime} onValueChange={(value) => handleInputChange("startTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wann möchtest du starten?" />
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

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Wird gesendet..." : "Passende Trainer*innen finden"}
                  </Button>

                  {submitStatus.success === false && (
                    <p className="text-red-600 text-sm text-center">{submitStatus.message}</p>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
