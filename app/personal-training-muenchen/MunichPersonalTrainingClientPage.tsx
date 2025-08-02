"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Target, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react"
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
  { value: "abnehmen", label: "Abnehmen", color: "bg-green-100 text-green-800" },
  { value: "gesundheit", label: "Gesundheit & Rücken", color: "bg-purple-100 text-purple-800" },
  { value: "haltung", label: "Haltung verbessern", color: "bg-orange-100 text-orange-800" },
  { value: "kraft", label: "Kraft steigern", color: "bg-red-100 text-red-800" },
  { value: "ausdauer", label: "Ausdauer", color: "bg-cyan-100 text-cyan-800" },
  { value: "beweglichkeit", label: "Beweglichkeit", color: "bg-pink-100 text-pink-800" },
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = new FormData(event.currentTarget)

      // Add required fields that might be missing
      formData.set("user_type", "client")
      formData.set("city", "München")

      console.log("Form data being submitted:", Object.fromEntries(formData.entries()))

      const result = await joinWaitlist(formData)
      setSubmitResult(result)

      if (result.success) {
        // Reset form on success
        event.currentTarget.reset()
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal Training in <span className="text-blue-600">München</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Der passende Coach für dich. Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's
            Trainer*innen, die dich verstehen und weiterbringen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Target className="mr-2 h-5 w-5" />
              Gratis Probetraining
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="mr-2 h-5 w-5" />
              App downloaden
            </Button>
          </div>
        </div>
      </section>

      {/* Target Audience Sections */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Beginners */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Users className="mr-3 h-6 w-6 text-blue-600" />
                Keine Ahnung, wie du anfangen sollst?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Viele Leute in München wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen halten
                sie ab. Unsere Coaches helfen beim Einstieg.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Kostenloses Probetraining
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Online-Beratung mit Fokus auf Gesundheit
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Einstieg mit Bewegungsanalyse & Haltungstraining
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Passenden Coach finden</Button>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Target className="mr-3 h-6 w-6 text-red-600" />
                Du trainierst hart, aber nichts passiert?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Wenn du in München ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
                  Maßgeschneiderte Programme
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
                  Fokus auf progressive Overload
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
                  App-Tracking und Analyse
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
                  Wissen zu Hypertrophie, Regeneration & Ernährung
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">Experten-Coach finden</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Beliebte Suchbegriffe</h3>
          <p className="text-gray-600 mb-8">Wir ranken für:</p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "personal trainer münchen",
              "fitnesscoach münchen",
              "probetraining münchen",
              "rücken stärken training münchen",
              "muskelaufbau trainer münchen",
            ].map((keyword) => (
              <Badge key={keyword} variant="secondary" className="px-4 py-2">
                {keyword}
              </Badge>
            ))}
          </div>

          <p className="text-lg text-gray-700">Das klingt nach dir? Dann trag dich ein.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Finde deinen passenden Coach in München</CardTitle>
              <CardDescription className="text-center">
                Fülle das Formular aus und wir finden zwei Trainer*innen, die zu dir passen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Dein vollständiger Name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="deine@email.de"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goal">Trainingsziel *</Label>
                  <Select name="goal" required>
                    <SelectTrigger className="mt-1">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">Stadtteil *</Label>
                    <Select name="district" required>
                      <SelectTrigger className="mt-1">
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
                    <Select name="startTime" required>
                      <SelectTrigger className="mt-1">
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
                  <Input id="phone" name="phone" type="tel" placeholder="+49 123 456789" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="message">Nachricht (optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Erzähl uns mehr über deine Ziele oder besonderen Wünsche..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {submitResult && (
                  <div
                    className={`p-4 rounded-lg flex items-center ${
                      submitResult.success
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitResult.success ? (
                      <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                      <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    {submitResult.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Browse Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Willst du erst mal stöbern?</h3>
          <p className="text-gray-600 mb-8">
            Hol dir die App. Klick dich durch Trainerprofile. Sag Bescheid, wenn du bereit bist.
          </p>

          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
            <Phone className="mr-2 h-5 w-5" />
            App downloaden
          </Button>
        </div>
      </section>

      {/* Trainer Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Trainer*innen aus München</h3>

          <div className="text-center text-gray-600 mb-8">
            <p>Wir zeigen nur aktive Coaches in München. Filter möglich nach:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-semibold">Stadtteil</h4>
              <p className="text-sm text-gray-600">Alle 25 Münchner Stadtteile</p>
            </div>

            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-semibold">Trainingsort</h4>
              <p className="text-sm text-gray-600">Studio, Outdoor, Home</p>
            </div>

            <div className="flex flex-col items-center">
              <Target className="h-8 w-8 text-purple-600 mb-2" />
              <h4 className="font-semibold">Spezialisierung</h4>
              <p className="text-sm text-gray-600">Erfahrung & Expertise</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
