"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useTheme } from "@/components/theme-provider"
import {
  MapPin,
  Users,
  Mail,
  CheckCircle,
  AlertCircle,
  Download,
  Star,
  ArrowRight,
  Activity,
  Calendar,
  MessageSquare,
  Share2,
} from "lucide-react"
import { joinWaitlist } from "@/actions/waitlist-actions"

const featureCardClass =
  "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full"

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
  const { setIsCoach } = useTheme()
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

  // Set client mode by default for Munich page
  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

      formDataObj.set("user_type", "client")
      formDataObj.set("city", "München")
      formDataObj.set("plan", "personal-training-munich")

      console.log("Submitting form with data:", Object.fromEntries(formDataObj.entries()))

      const result = await joinWaitlist(formDataObj)
      console.log("Form submission result:", result)

      setSubmitResult(result)

      if (result.success) {
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
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar isHomePage={false} />

      {/* Hero Section - matching your main page style */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-gray-50 to-white">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-juice/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-juice/10 blur-3xl" />
        </div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <Badge variant="outline" className="bg-juice/10 text-juice border-juice/50 mb-6 font-semibold">
                  <MapPin className="h-4 w-4 mr-2" />
                  München
                </Badge>
              </motion.div>

              <h1 className="text-5xl font-bold text-center text-gray-900">
                Personal Training in <span className="juice-text-gradient">München</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-900">Der passende Coach für dich</p>
              <p className="mx-auto max-w-[600px] text-gray-600">
                Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's Trainer*innen, die dich
                verstehen und weiterbringen.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-2 w-full sm:w-auto mx-auto"
            >
              <Button
                size="lg"
                className="bg-juice text-juice-foreground hover:bg-juice/90 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto"
              >
                Gratis Probetraining
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 bg-white text-gray-900 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto bg-transparent"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                App downloaden
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - matching your existing style */}
      <div className="pt-8 pb-0 bg-white maintain-scroll">
        <div className="container px-4 md:px-6 pb-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-gray-900 font-medium mb-3">MÜNCHEN TRAINING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Zwei Wege zu deinem Ziel</h2>
            <p className="text-gray-600 max-w-2xl">
              Ob Einsteiger oder Fortgeschrittener – wir haben den passenden Ansatz für dich
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Beginners Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className={featureCardClass}>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="mr-4 mt-1">
                    <Activity className="h-6 w-6 text-juice" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      🧍‍♂️ Keine Ahnung, wie du anfangen sollst?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Viele Leute in München wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen
                      halten sie ab. Unsere Coaches helfen beim Einstieg.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Kostenloses Probetraining
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Online-Beratung mit Fokus auf Gesundheit
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Einstieg mit Bewegungsanalyse & Haltungstraining
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Advanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className={featureCardClass}>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="mr-4 mt-1">
                    <Calendar className="h-6 w-6 text-juice" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      🏋️‍♂️ Du trainierst hart, aber nichts passiert?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Wenn du in München ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Maßgeschneiderte Programme
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Fokus auf progressive Overload
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        App-Tracking und Analyse
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-juice" />
                        Wissen zu Hypertrophie, Regeneration & Ernährung
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Muskelaufbau
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Leistung
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Technikanalyse
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Browse Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className={featureCardClass}>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="mr-4 mt-1">
                    <MessageSquare className="h-6 w-6 text-juice" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">📱 Willst du erst mal stöbern?</h3>
                    <p className="text-gray-600 mb-4">
                      Hol dir die App. Klick dich durch Trainerprofile. Sag Bescheid, wenn du bereit bist.
                    </p>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-white text-gray-900">
                      <Download className="mr-2 h-4 w-4" />
                      App downloaden
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trainer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className={featureCardClass}>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="mr-4 mt-1">
                    <Share2 className="h-6 w-6 text-juice" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Trainer*innen aus München</h3>
                    <p className="text-gray-600 mb-4">
                      Wir zeigen nur aktive Coaches in München. Filter möglich nach Stadtteil, Trainingsort und
                      Spezialisierung.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        <MapPin className="h-3 w-3 mr-1" />
                        25 Stadtteile
                      </Badge>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        <Users className="h-3 w-3 mr-1" />
                        Studio & Outdoor
                      </Badge>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        <Star className="h-3 w-3 mr-1" />
                        Alle Levels
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SEO Keywords Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Beliebte Suchbegriffe</h2>
          <p className="text-gray-600 mb-8">Wir ranken für:</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "personal trainer münchen",
              "fitnesscoach münchen",
              "probetraining münchen",
              "rücken stärken training münchen",
              "muskelaufbau trainer münchen",
            ].map((keyword) => (
              <Badge key={keyword} variant="outline" className="px-4 py-2 border-gray-300 text-gray-700 bg-white">
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-lg font-medium text-gray-900">Das klingt nach dir? Dann trag dich ein.</p>
        </div>
      </section>

      {/* Contact Form - matching your CTA section style */}
      <section id="cta" className="pt-10 pb-0">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 md:p-12"
          >
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-juice/20 blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-juice/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
                Finde deinen passenden Coach in München
              </h2>
              <p className="text-gray-600 mb-8">
                Fülle das Formular aus und wir finden zwei Trainer*innen, die zu dir passen.
              </p>

              {submitResult?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Vielen Dank!</h3>
                  <p className="text-gray-600">{submitResult.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                  {/* Hidden fields */}
                  <input type="hidden" name="user_type" value="client" />
                  <input type="hidden" name="city" value="München" />
                  <input type="hidden" name="plan" value="personal-training-munich" />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-black">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="Dein Name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-black">
                        E-Mail *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="deine@email.de"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goal" className="text-black">
                      Trainingsziel *
                    </Label>
                    <Select
                      name="goal"
                      value={formData.goal}
                      onValueChange={(value) => handleInputChange("goal", value)}
                      required
                    >
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district" className="text-black">
                        Stadtteil *
                      </Label>
                      <Select
                        name="district"
                        value={formData.district}
                        onValueChange={(value) => handleInputChange("district", value)}
                        required
                      >
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
                      <Label htmlFor="startTime" className="text-black">
                        Startzeitpunkt *
                      </Label>
                      <Select
                        name="startTime"
                        value={formData.startTime}
                        onValueChange={(value) => handleInputChange("startTime", value)}
                        required
                      >
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
                    <Label htmlFor="phone" className="text-black">
                      Telefon (optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+49 89 123456789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-black">
                      Nachricht (optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Erzähl uns mehr über deine Ziele oder Wünsche..."
                      rows={3}
                      className="mt-1"
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
                    className="w-full client-gradient-btn text-black py-3 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
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
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
