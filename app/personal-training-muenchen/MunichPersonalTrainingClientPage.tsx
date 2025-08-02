"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Users, Mail, CheckCircle, AlertCircle, Download, Star } from "lucide-react"
import { joinWaitlist } from "@/actions/waitlist-actions"

const munichDistricts = [
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
  "Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln",
  "Hadern",
  "Pasing-Obermenzing",
  "Aubing-Lochhausen-Langwied",
  "Allach-Untermenzing",
  "Feldmoching-Hasenbergl",
  "Laim",
]

const fitnessGoals = [
  { value: "muskelaufbau", label: "Muskelaufbau", color: "bg-blue-100 text-blue-800" },
  { value: "abnehmen", label: "Abnehmen & Körperfett reduzieren", color: "bg-green-100 text-green-800" },
  { value: "gesundheit", label: "Gesundheit & Rücken", color: "bg-purple-100 text-purple-800" },
  { value: "haltung", label: "Haltung verbessern", color: "bg-orange-100 text-orange-800" },
  { value: "kraft", label: "Kraft & Leistung steigern", color: "bg-red-100 text-red-800" },
  { value: "einstieg", label: "Einstieg ins Training", color: "bg-cyan-100 text-cyan-800" },
  { value: "beweglichkeit", label: "Beweglichkeit & Mobilität", color: "bg-pink-100 text-pink-800" },
]

const startTimes = [
  { value: "sofort", label: "Sofort" },
  { value: "1-2-wochen", label: "In 1-2 Wochen" },
  { value: "1-monat", label: "In einem Monat" },
  { value: "2-3-monate", label: "In 2-3 Monaten" },
  { value: "unbestimmt", label: "Noch unbestimmt" },
]

export default function MunichPersonalTrainingClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goal: "",
    district: "",
    startTime: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear any previous error when user starts typing
    if (submitResult && !submitResult.success) {
      setSubmitResult(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const form = event.currentTarget
      const formDataObj = new FormData(form)

      // Ensure required hidden fields are set
      formDataObj.set("user_type", "client")
      formDataObj.set("city", "München")
      formDataObj.set("plan", "personal-training-munich")

      console.log("Submitting form with data:", Object.fromEntries(formDataObj.entries()))

      const result = await joinWaitlist(formDataObj)
      console.log("Form submission result:", result)

      setSubmitResult(result)

      if (result.success) {
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          goal: "",
          district: "",
          startTime: "",
          phone: "",
          message: "",
        })
        form.reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitResult({
        success: false,
        message: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <MapPin className="h-4 w-4 mr-2" />
              München
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Personal Training in <span className="text-blue-600">München</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">Der passende Coach für dich</p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's Trainer*innen, die dich verstehen
              und weiterbringen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

                <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-medium">
                    💡 Formular ausfüllen – wir finden zwei Trainer*innen, die passen.
                  </p>
                </div>
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

                <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-orange-800 font-medium mb-2">🎯 Jetzt eintragen und passenden Coach erhalten.</p>
                  <p className="text-orange-700 text-sm">
                    Erstgespräch kostenlos • Geld zurück bei Buchung nach Probesession
                  </p>
                </div>
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

              {submitResult?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vielen Dank!</h3>
                  <p className="text-gray-600">{submitResult.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hidden fields */}
                  <input type="hidden" name="user_type" value="client" />
                  <input type="hidden" name="city" value="München" />
                  <input type="hidden" name="plan" value="personal-training-munich" />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
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
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="deine@email.de"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goal">Trainingsziel *</Label>
                    <Select
                      name="goal"
                      value={formData.goal}
                      onValueChange={(value) => handleInputChange("goal", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle dein Hauptziel" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessGoals.map((goal) => (
                          <SelectItem key={goal.value} value={goal.value}>
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">Stadtteil *</Label>
                      <Select
                        name="district"
                        value={formData.district}
                        onValueChange={(value) => handleInputChange("district", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle deinen Stadtteil" />
                        </SelectTrigger>
                        <SelectContent>
                          {munichDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="startTime">Startzeitpunkt *</Label>
                      <Select
                        name="startTime"
                        value={formData.startTime}
                        onValueChange={(value) => handleInputChange("startTime", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wann möchtest du starten?" />
                        </SelectTrigger>
                        <SelectContent>
                          {startTimes.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+49 89 123456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Nachricht (optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Erzähl uns mehr über deine Ziele oder Wünsche..."
                      rows={3}
                    />
                  </div>

                  {submitResult && !submitResult.success && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-red-800 text-sm">{submitResult.message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Passenden Coach finden
                      </>
                    )}
                  </Button>
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
