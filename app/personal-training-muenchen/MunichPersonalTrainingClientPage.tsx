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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useTheme } from "@/components/theme-provider"
import {
  MapPin,
  Mail,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
  Activity,
  Calendar,
  ChevronRight,
  ChevronLeft,
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

// Define form steps
const formSteps = [
  { id: "basic", fields: ["name", "email"], title: "Grunddaten" },
  { id: "goal", fields: ["goal"], title: "Trainingsziel" },
  { id: "location", fields: ["district", "startTime"], title: "Ort & Zeit" },
  { id: "contact", fields: ["phone", "message"], title: "Kontakt & Details" },
]

export default function MunichPersonalTrainingClientPage() {
  const { setIsCoach } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goal: "",
    district: "",
    startTime: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Set client mode by default for Munich page
  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  // Reset submission state when step changes
  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false)
    }
  }, [currentStep])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (submitResult && !submitResult.success) {
      setSubmitResult(null)
    }
  }

  const validateCurrentStep = (): boolean => {
    const currentFields = formSteps[currentStep].fields
    const newErrors: Record<string, string> = {}

    currentFields.forEach((field) => {
      if (field === "name" && !formData.name.trim()) {
        newErrors.name = "Name ist erforderlich"
      }
      if (field === "email") {
        if (!formData.email.trim()) {
          newErrors.email = "E-Mail ist erforderlich"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de)"
        }
      }
      if (field === "goal" && !formData.goal) {
        newErrors.goal = "Bitte wähle dein Trainingsziel"
      }
      if (field === "district" && !formData.district) {
        newErrors.district = "Bitte wähle deinen Stadtteil"
      }
      if (field === "startTime" && !formData.startTime) {
        newErrors.startTime = "Bitte wähle deinen Startzeitpunkt"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canProceedToNext = (): boolean => {
    const currentFields = formSteps[currentStep].fields

    if (currentStep === 0) {
      // Basic info - be more lenient with email validation for UX
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return formData.name.trim() !== "" && formData.email.trim() !== "" && emailRegex.test(formData.email.trim())
    }
    if (currentStep === 1) {
      // Goal
      return formData.goal !== ""
    }
    if (currentStep === 2) {
      // Location & Time
      return formData.district !== "" && formData.startTime !== ""
    }

    // Contact step is optional
    return true
  }

  const nextStep = () => {
    if (validateCurrentStep() && canProceedToNext() && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only submit if we're on the last step
    if (currentStep !== formSteps.length - 1) {
      return
    }

    // Prevent double submission
    if (isSubmitting) {
      return
    }

    if (!validateCurrentStep()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.set(key, value)
      })

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
        setCurrentStep(0)
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

  const renderCurrentStepFields = () => {
    const step = formSteps[currentStep]

    switch (step.id) {
      case "basic":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                E-Mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="name@beispiel.de"
                className={`mt-2 h-12 ${errors.email ? "border-red-500" : ""} ${
                  formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "border-orange-400" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {formData.email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <p className="text-orange-600 text-sm mt-1">Bitte gib eine gültige E-Mail-Adresse ein</p>
              )}
            </div>
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Dein Name"
                className={`mt-2 h-12 ${errors.name ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>
        )

      case "goal":
        return (
          <div>
            <Label htmlFor="goal" className="text-base font-medium">
              Trainingsziel <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => handleInputChange("goal", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={`mt-2 h-12 ${errors.goal ? "border-red-500" : ""}`}>
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
            {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
          </div>
        )

      case "location":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="district" className="text-base font-medium">
                Stadtteil <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`mt-2 h-12 ${errors.district ? "border-red-500" : ""}`}>
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
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
            </div>

            <div>
              <Label htmlFor="startTime" className="text-base font-medium">
                Startzeitpunkt <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleInputChange("startTime", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`mt-2 h-12 ${errors.startTime ? "border-red-500" : ""}`}>
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
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-base font-medium">
                Telefon (optional)
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+49 89 123456789"
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-base font-medium">
                Nachricht (optional)
              </Label>
              <p className="text-sm text-gray-600 mt-1 mb-2">Erzähl uns mehr über deine Ziele oder Wünsche...</p>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Ich möchte..."
                className="mt-2 min-h-32"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar isHomePage={false} />

      {/* Floating App Download Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 bg-juice hover:bg-juice/90 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm md:text-base md:px-6 md:py-3"
      >
        <Download className="h-5 w-5" />
        App downloaden
      </Button>

      {/* Hero Section */}
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
                <Badge
                  variant="outline"
                  className="bg-juice/20 text-black border-juice border-2 mb-6 font-bold text-base px-4 py-1.5 shadow-sm"
                >
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
                className="bg-juice text-black hover:bg-juice/90 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto font-bold"
                onClick={() => {
                  const formElement = document.getElementById("coach-finder-form")
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
              >
                Gratis Probetraining
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
          </div>
        </div>
      </div>

      {/* Step-by-Step Form Section */}
      <section id="coach-finder-form" className="pt-10 pb-0">
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

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
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
                <Card className="shadow-xl border-0 w-full max-w-lg mx-auto">
                  <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="text-2xl text-center">Coach-Finder</CardTitle>

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Schritt {currentStep + 1} von {formSteps.length}
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round(((currentStep + 1) / formSteps.length) * 100)}% abgeschlossen
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-juice h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">{formSteps[currentStep].title}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="min-h-[250px]">{renderCurrentStepFields()}</div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center pt-8 mt-8 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          disabled={currentStep === 0 || isSubmitting}
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Zurück
                        </Button>

                        {currentStep < formSteps.length - 1 ? (
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceedToNext() || isSubmitting}
                            className="bg-juice hover:bg-juice/90 text-black flex items-center gap-2 font-bold"
                          >
                            Weiter
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isSubmitting}
                            className="bg-juice hover:bg-juice/90 text-black font-bold px-8 py-3 border-2 border-juice shadow-lg"
                            onClick={async (e) => {
                              e.preventDefault()
                              e.stopPropagation()

                              if (isSubmitting) return

                              await handleSubmit(e as any)
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                Wird gesendet...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Passenden Coach finden
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>

                    {submitResult && !submitResult.success && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mt-4">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-800 text-sm">{submitResult.message}</p>
                      </div>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-4">
                      Kostenlos und unverbindlich. Wir finden passende Trainer*innen für dich.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
