"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Target, CheckCircle, Star, Dumbbell, Heart, Smartphone, Users, Award, TrendingUp } from "lucide-react"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { useActionState } from "react"
import Link from "next/link"

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
  "Muskelaufbau",
  "Abnehmen & Körperfett reduzieren",
  "Gesundheit & Wohlbefinden",
  "Haltung verbessern",
  "Kraft & Leistung steigern",
  "Rücken stärken",
  "Einstieg ins Training",
]

const startTimes = ["sofort", "in 1-2 Wochen", "in 2-4 Wochen", "in 1-2 Monaten", "bin noch unentschlossen"]

const seoKeywords = [
  "personal trainer münchen",
  "fitnesscoach münchen",
  "probetraining münchen",
  "rücken stärken training münchen",
  "muskelaufbau trainer münchen",
]

export default function MunichPersonalTrainingClientPage() {
  const [state, action, isPending] = useActionState(joinWaitlist, null)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <MapPin className="h-4 w-4 mr-2" />
              München
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Personal Training in München</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">Der passende Coach für dich</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">✅ Einfach starten</h2>
            <p className="text-lg text-gray-700 mb-8">
              Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's Trainer*innen, die dich verstehen
              und weiterbringen.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Gratis Probetraining</h3>
                <p className="text-gray-600">oder Video-Call zum Kennenlernen</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <Smartphone className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">App downloaden</h3>
                <p className="text-gray-600">wenn du erstmal schauen willst</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Sections */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Beginners Section */}
            <Card className="border-2 border-orange-200 bg-orange-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-orange-600" />
                  <CardTitle className="text-2xl text-gray-900">🧍‍♂️ Keine Ahnung, wie du anfangen sollst?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Viele Leute in München wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen
                  halten sie ab. Unsere Coaches helfen beim Einstieg.
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900">Typische Angebote:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Kostenloses Probetraining</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Online-Beratung mit Fokus auf Gesundheit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Einstieg mit Bewegungsanalyse & Haltungstraining</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    💡 Formular ausfüllen – wir finden zwei Trainer*innen, die passen.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Section */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Dumbbell className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl text-gray-900">🏋️‍♂️ Du trainierst hart, aber nichts passiert?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Wenn du in München ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.
                </p>

                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900">Was du bekommst:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Maßgeschneiderte Programme</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Fokus auf progressive Overload</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span>App-Tracking und Analyse</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span>Wissen zu Hypertrophie, Regeneration & Ernährung</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <Badge variant="outline" className="justify-center py-2">
                    Muskelaufbau
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    Leistung
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    Technikanalyse
                  </Badge>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 font-medium mb-2">🎯 Jetzt eintragen und passenden Coach erhalten.</p>
                  <p className="text-blue-700 text-sm">
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
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📱 Willst du erst mal stöbern?</h2>
              <p className="text-gray-700 mb-6">
                Hol dir die App. Klick dich durch Trainerprofile. Sag Bescheid, wenn du bereit bist.
              </p>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                App downloaden
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trainer*innen aus München</h2>
            <p className="text-gray-600 mb-8">Wir zeigen nur aktive Coaches in München. Filter möglich nach:</p>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                <MapPin className="h-4 w-4 mr-2" />
                Stadtteil
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                <Users className="h-4 w-4 mr-2" />
                Trainingsort
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                <Award className="h-4 w-4 mr-2" />
                Spezialisierung
              </Badge>
            </div>
          </div>

          {/* Mock trainer cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">T{i}</span>
                  </div>
                  <h3 className="font-semibold text-center mb-2">Trainer {i}</h3>
                  <div className="flex justify-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      Schwabing
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Muskelaufbau
                    </Badge>
                  </div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beliebte Suchbegriffe</h2>
          <p className="text-gray-600 mb-8">Wir ranken für:</p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {seoKeywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-white border-gray-300 text-gray-700 py-2 px-4">
                {keyword}
              </Badge>
            ))}
          </div>

          <p className="text-lg font-medium text-gray-900">Das klingt nach dir? Dann trag dich ein.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-blue-100">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-2">Finde deinen Coach</CardTitle>
              <p className="text-gray-600">Fülle das Formular aus und wir finden passende Trainer*innen für dich</p>
            </CardHeader>
            <CardContent>
              {state?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfekt!</h3>
                  <p className="text-gray-600">{state.message}</p>
                </div>
              ) : (
                <form action={action} className="space-y-6">
                  {/* Hidden fields */}
                  <input type="hidden" name="user_type" value="client" />
                  <input type="hidden" name="city" value="München" />

                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                      placeholder="Dein vollständiger Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-Mail *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      placeholder="deine@email.de"
                    />
                  </div>

                  {/* Goal */}
                  <div>
                    <Label htmlFor="goal" className="text-sm font-medium text-gray-700">
                      Ziel *
                    </Label>
                    <Select name="goal" required onValueChange={(value) => handleInputChange("goal", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Was möchtest du erreichen?" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessGoals.map((goal) => (
                          <SelectItem key={goal} value={goal}>
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div>
                    <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                      Stadtteil *
                    </Label>
                    <Select name="district" required onValueChange={(value) => handleInputChange("district", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="In welchem Stadtteil suchst du?" />
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

                  {/* Start Time */}
                  <div>
                    <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                      Startzeitpunkt *
                    </Label>
                    <Select name="startTime" required onValueChange={(value) => handleInputChange("startTime", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wann möchtest du starten?" />
                      </SelectTrigger>
                      <SelectContent>
                        {startTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Optionale Angaben</h4>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                        placeholder="+49 89 123456789"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Nachricht
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="mt-1"
                        placeholder="Erzähl uns mehr über deine Ziele oder Wünsche..."
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {state && !state.success && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{state.message}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      "Passende Trainer finden"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Mit dem Absenden stimmst du unseren{" "}
                    <Link href="/legal" className="text-blue-600 hover:underline">
                      Datenschutzbestimmungen
                    </Link>{" "}
                    zu.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
