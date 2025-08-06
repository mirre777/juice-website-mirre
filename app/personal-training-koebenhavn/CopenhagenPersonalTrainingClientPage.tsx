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
import { MapPin, CheckCircle, AlertCircle, Download, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { joinWaitlist } from "@/actions/waitlist-actions"

const featureCardClass =
  "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full"

const copenhagenDistricts = [
  "Indre By",
  "Vesterbro",
  "Nørrebro",
  "Østerbro",
  "Frederiksberg",
  "Amager",
  "Valby",
  "Vanløse",
  "Brønshøj",
  "Bispebjerg",
]

const fitnessGoals = [
  { value: "sundhed", label: "Sundhed & Holdning", color: "bg-purple-100 text-purple-800" },
  { value: "muskelopbygning", label: "Muskelopbygning", color: "bg-blue-100 text-blue-800" },
  { value: "vaegttab", label: "Vægttab", color: "bg-green-100 text-green-800" },
  { value: "holdning", label: "Holdning", color: "bg-orange-100 text-orange-800" },
  { value: "begynder", label: "Begynder træning", color: "bg-cyan-100 text-cyan-800" },
  { value: "styrke", label: "Styrke & Performance", color: "bg-red-100 text-red-800" },
]

const startTimes = [
  { value: "nu", label: "Nu" },
  { value: "1-2-uger", label: "Om 1-2 uger" },
  { value: "1-maaned", label: "Om en måned" },
  { value: "2-3-maaneder", label: "Om 2-3 måneder" },
  { value: "ukendt", label: "Ved ikke endnu" },
]

// Define form steps
const formSteps = [
  { id: "basic", fields: ["name", "email"], title: "Grundoplysninger" },
  { id: "goal", fields: ["goal"], title: "Træningsmål" },
  { id: "location", fields: ["district", "startTime"], title: "Lokation & Timing" },
  { id: "contact", fields: ["phone", "message"], title: "Kontakt & Detaljer" },
]

export default function CopenhagenPersonalTrainingClientPage() {
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

  // Set client mode by default for Copenhagen page
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
        newErrors.name = "Navn er påkrævet"
      }
      if (field === "email") {
        if (!formData.email.trim()) {
          newErrors.email = "E-mail er påkrævet"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = "Indtast en gyldig e-mailadresse (f.eks. navn@eksempel.dk)"
        }
      }
      if (field === "goal" && !formData.goal) {
        newErrors.goal = "Vælg dit træningsmål"
      }
      if (field === "district" && !formData.district) {
        newErrors.district = "Vælg din bydel"
      }
      if (field === "startTime" && !formData.startTime) {
        newErrors.startTime = "Vælg hvornår du vil starte"
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
    setSubmitResult(null) // Clear previous results

    try {
      const formDataObj = new FormData()

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.set(key, value)
      })

      formDataObj.set("user_type", "client")
      formDataObj.set("city", "København")
      formDataObj.set("plan", "personal-training-copenhagen")

      const result = await joinWaitlist(formDataObj)

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
        message: "Der opstod en fejl. Prøv igen.",
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
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="navn@eksempel.dk"
                className={`mt-2 h-12 ${errors.email ? "border-red-500" : ""} ${
                  formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "border-orange-400" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {formData.email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <p className="text-orange-600 text-sm mt-1">Indtast en gyldig e-mailadresse</p>
              )}
            </div>
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Navn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Dit navn"
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
              Træningsmål <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => handleInputChange("goal", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={`mt-2 h-12 ${errors.goal ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Vælg dit hovedmål" />
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
                Bydel <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`mt-2 h-12 ${errors.district ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Vælg din bydel" />
                </SelectTrigger>
                <SelectContent>
                  {copenhagenDistricts.map((district) => (
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
                Startdato <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleInputChange("startTime", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`mt-2 h-12 ${errors.startTime ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Hvornår vil du starte?" />
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
                Telefon (valgfrit)
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+45 12 34 56 78"
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-base font-medium">
                Besked (valgfrit)
              </Label>
              <p className="text-sm text-gray-600 mt-1 mb-2">Fortæl os mere om dine mål eller ønsker...</p>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Jeg vil gerne..."
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
        asChild
      >
        <a href="https://www.juice.fitness/download-juice-app" target="_blank" rel="noopener noreferrer">
          <Download className="h-5 w-5" />
          Download appen
        </a>
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
                  København
                </Badge>
              </motion.div>

              <h1 className="text-5xl font-bold text-center text-gray-900">
                Personlig træning i <span className="juice-text-gradient">København</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-900">Find din træner</p>
              <p className="mx-auto max-w-[600px] text-gray-600">
                Vil du bare i bedre form eller bryde igennem din træningsvæg? Vi har trænere i København, der ved hvordan.
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
                Gratis prøvetime
                <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="pt-8 pb-0 bg-white maintain-scroll">
        <div className="container px-4 md:px-6 pb-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-gray-900 font-medium mb-3">KØBENHAVN TRÆNING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">To måder at starte på</h2>
            <p className="text-gray-600 max-w-2xl">
              Gratis prøvetime eller videosamtale, eller download appen hvis du vil vente og kigge først
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Beginners Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className={featureCardClass}>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="mr-4 mt-1">
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      🙋 Første gang i fitness?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Du behøver ikke kende øvelserne eller have udstyret i orden. Mange københavnske trænere arbejder med folk, der vil i gang – uden pres.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Gratis prøvetime i et lokalt træningscenter
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Online intro med en personlig træner
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Fokus på mobilitet, hverdagsstyrke og sundhed
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
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      🏋️ Seriøs omkring din træning?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      København er fyldt med trænere, der kan hjælpe dig forbi plateauer og give dig et system:
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Program med progressive overload
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Tydelig plan og feedback i appen
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-700" />
                        Fokus på hypertrofi, styrke og performance
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Muskelmasse
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Max styrke
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Performance
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
                Find din træner i København
              </h2>
              <p className="text-gray-600 mb-8">
                Udfyld formularen, så matcher vi dig med 2 trænere, der passer til dig.
              </p>

              {submitResult?.success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tak!</h3>
                  <p className="text-gray-600">{submitResult.message}</p>
                </div>
              ) : (
                <Card className="shadow-xl border-0 w-full max-w-lg mx-auto">
                  <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="text-2xl text-center">Træner-Finder</CardTitle>

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Trin {currentStep + 1} af {formSteps.length}
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round(((currentStep + 1) / formSteps.length) * 100)}% færdig
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
                          Tilbage
                        </Button>

                        {currentStep < formSteps.length - 1 ? (
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceedToNext() || isSubmitting}
                            className="bg-juice hover:bg-juice/90 text-black flex items-center gap-2 font-bold"
                          >
                            Videre
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
                                Sender...
                              </>
                            ) : (
                              "Send"
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
                      Gratis og uforpligtende. Vi finder trænere, der passer til dig.
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
