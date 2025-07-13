"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Mail,
  Phone,
  Award,
  Zap,
  Loader2,
  AlertCircle,
  CreditCard,
  Sparkles,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { logger } from "@/lib/logger"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  expiresAt: string
  timeRemaining: number
}

interface TempTrainerPageProps {
  tempId: string
  token: string
}

export default function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTrainerData()
  }, [tempId, token])

  useEffect(() => {
    if (trainer) {
      // Start generation animation
      const generationTimer = setTimeout(() => {
        setGenerationComplete(true)
        logger.info("Website generation animation completed", {
          tempId,
          email: trainer.email,
        })
      }, 8000) // 8 second generation animation

      return () => clearTimeout(generationTimer)
    }
  }, [trainer, tempId])

  useEffect(() => {
    if (trainer && timeRemaining > 0) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const expiresAt = new Date(trainer.expiresAt).getTime()
        const remaining = expiresAt - now

        if (remaining <= 0) {
          setTimeRemaining(0)
          logger.warn("Session expired during viewing", {
            tempId,
            email: trainer.email,
          })
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [trainer, timeRemaining, tempId])

  const fetchTrainerData = async () => {
    try {
      logger.info("Fetching temp trainer data", {
        tempId,
        hasToken: !!token,
      })

      const response = await fetch(`/api/trainer/temp/${tempId}?token=${token}`)
      const result = await response.json()

      if (result.success) {
        if (result.isActivated) {
          logger.info("Trainer already activated, redirecting", {
            tempId,
            finalId: result.finalId,
          })
          router.push(result.redirectUrl)
          return
        }

        setTrainer(result.trainer)
        setTimeRemaining(result.trainer.timeRemaining)

        logger.info("Temp trainer data loaded successfully", {
          tempId,
          email: result.trainer.email,
          specialty: result.trainer.specialty,
          timeRemaining: Math.round(result.trainer.timeRemaining / (1000 * 60 * 60)) + " hours",
        })
      } else {
        logger.error("Failed to fetch trainer data", {
          tempId,
          error: result.error,
          expired: result.expired,
        })

        if (result.expired) {
          setError("Your session has expired. Please create a new trainer profile.")
        } else {
          setError(result.error || "Failed to load trainer data")
        }
      }
    } catch (err) {
      logger.error("Network error fetching trainer data", {
        tempId,
        error: err,
      })
      setError("Network error. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!trainer) return

    setIsProcessingPayment(true)

    try {
      logger.info("Initiating payment process", {
        tempId,
        email: trainer.email,
        amount: 2900,
        currency: "EUR",
      })

      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2900, // €29.00 in cents
          currency: "eur",
          metadata: {
            type: "trainer_activation",
            tempId,
            email: trainer.email,
            specialty: trainer.specialty,
          },
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      if (!clientSecret) {
        throw new Error("Failed to create payment intent")
      }

      logger.info("Payment intent created", {
        tempId,
        paymentIntentId,
        email: trainer.email,
      })

      // Initialize Stripe
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would normally be a card element, but for demo purposes
            // we'll simulate a successful payment
          },
        },
      })

      if (error) {
        logger.error("Payment failed", {
          tempId,
          error: error.message,
          email: trainer.email,
        })
        throw new Error(error.message)
      }

      if (paymentIntent?.status === "succeeded") {
        logger.info("Payment succeeded, activating trainer", {
          tempId,
          paymentIntentId: paymentIntent.id,
          email: trainer.email,
        })

        // Activate trainer profile
        const activationResponse = await fetch("/api/trainer/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tempId,
            paymentIntentId: paymentIntent.id,
          }),
        })

        const activationResult = await activationResponse.json()

        if (activationResult.success) {
          logger.info("Trainer activation successful", {
            tempId,
            finalId: activationResult.finalId,
            email: trainer.email,
          })

          // Redirect to final trainer page
          router.push(activationResult.redirectUrl)
        } else {
          throw new Error(activationResult.error || "Activation failed")
        }
      }
    } catch (err) {
      logger.error("Payment process error", {
        tempId,
        error: err,
        email: trainer?.email,
      })
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#D2FF28]" />
          <p className="text-gray-600">Loading your trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Trainer data not found</p>
      </div>
    )
  }

  if (timeRemaining <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
            <p className="text-gray-600 mb-4">
              Your 24-hour preview period has expired. Please create a new trainer profile.
            </p>
            <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D2FF28] rounded-full">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Website Preview</h1>
                <p className="text-sm text-gray-600">24-hour trial period</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Time remaining: {formatTimeRemaining(timeRemaining)}</span>
                </div>
              </div>

              {generationComplete && (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="bg-[#D2FF28] hover:bg-[#B8E625] text-black font-semibold px-6"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Activate for €29
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generation Animation */}
      {!generationComplete && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-[#D2FF28] animate-pulse" />
                <h2 className="text-2xl font-bold">Generating Your Website...</h2>
              </div>
              <p className="text-gray-600 mb-6">Our AI is creating your professional trainer website</p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-[#D2FF28] h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
                </div>
                <p className="text-sm text-gray-500">This will take just a few seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website Preview */}
      {generationComplete && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-[#D2FF28] to-[#B8E625] p-8 text-black">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Body, Transform Your Life</h1>
                <p className="text-xl mb-6 opacity-90">
                  {trainer.specialty} • {trainer.experience} Experience • {trainer.location}
                </p>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Book Your Free Consultation
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#D2FF28]" />
                    About {trainer.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{trainer.bio}</p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D2FF28]" />
                      <span className="text-sm font-medium">{trainer.experience} Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Certified Professional</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card>
                <CardHeader>
                  <CardTitle>My Training Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainer.services.map((service, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">{service}</h3>
                        <p className="text-sm text-gray-600">
                          Personalized {service.toLowerCase()} sessions tailored to your goals
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-[#D2FF28]">From €60/session</span>
                          <Badge variant="outline">60 min</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>What My Clients Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-2">
                        "Working with {trainer.fullName.split(" ")[0]} has been life-changing. Their expertise in{" "}
                        {trainer.specialty.toLowerCase()} helped me achieve results I never thought possible."
                      </p>
                      <p className="text-sm font-medium">- Sarah M.</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-2">
                        "Professional, knowledgeable, and motivating. {trainer.fullName.split(" ")[0]} creates
                        personalized programs that actually work."
                      </p>
                      <p className="text-sm font-medium">- Mike R.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{trainer.email}</span>
                  </div>

                  {trainer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{trainer.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{trainer.location}</span>
                  </div>

                  <Separator />

                  <Button className="w-full bg-[#D2FF28] hover:bg-[#B8E625] text-black">Schedule Consultation</Button>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className="bg-[#D2FF28] text-black">{trainer.specialty}</Badge>
                    {trainer.certifications && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Certifications</h4>
                        <p className="text-sm text-gray-600">{trainer.certifications}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-[#D2FF28] to-[#B8E625] text-black">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Ready to Start?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Book your free consultation today and take the first step towards your fitness goals.
                  </p>
                  <Button className="bg-black text-white hover:bg-gray-800">Get Started Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
