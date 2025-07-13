"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PaymentModal } from "@/components/payment/payment-modal"
import {
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Award,
  Zap,
  Database,
  Palette,
  TrendingUp,
  X,
  CreditCard,
} from "lucide-react"
import Navbar from "@/components/navbar"

export default function TempTrainerPage() {
  const [showGenerationModal, setShowGenerationModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const generationSteps = [
    {
      message: "Creating base page structure",
      icon: <Zap className="w-6 h-6" />,
      description: "Setting up your professional trainer layout",
    },
    {
      message: "Importing data from Google",
      icon: <Database className="w-6 h-6" />,
      description: "Pulling your information from the form",
    },
    {
      message: "Personalizing design",
      icon: <Palette className="w-6 h-6" />,
      description: "Customizing colors and style for your brand",
    },
    {
      message: "Boost trainer visibility",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Optimizing for client discovery",
    },
  ]

  useEffect(() => {
    if (showGenerationModal) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= generationSteps.length - 1) {
            clearInterval(interval)
            setTimeout(() => {
              setShowGenerationModal(false)
              setIsGenerated(true)
            }, 1000)
            return prev
          }
          return prev + 1
        })
      }, 1200) // 1.2 seconds per step = ~5 seconds total

      return () => clearInterval(interval)
    }
  }, [showGenerationModal])

  const handlePaymentComplete = async () => {
    try {
      setPaymentCompleted(true)
      setShowPaymentModal(false)

      // Here you would create the actual trainer profile with unique ID
      // For now, we'll simulate the process

      // Generate a unique trainer ID (in real implementation, this would come from your database)
      const trainerId = Math.floor(Math.random() * 9000) + 1000 // Random 4-digit ID

      // In a real implementation, you would:
      // 1. Save trainer data to database with the generated ID
      // 2. Create the actual trainer profile page
      // 3. Send email with the unique URL

      // Simulate API call to create trainer profile
      console.log("Creating trainer profile with ID:", trainerId)

      // Show success message with the new URL
      alert(
        `Payment successful! Your trainer profile is now live at: /marketplace/trainer/${trainerId}\n\nYou'll receive a confirmation email with your unique URL shortly.`,
      )

      // Redirect to the new trainer profile (in real implementation)
      // window.location.href = `/marketplace/trainer/${trainerId}`
    } catch (error) {
      console.error("Error processing payment completion:", error)
      alert("Payment was successful, but there was an error setting up your profile. Please contact support.")
    }
  }

  // Sample trainer data (this would come from the form submission)
  const trainerData = {
    name: "Your Name",
    specialty: "Personal Training",
    location: "Your City",
    experience: "5+ Years",
    bio: "Passionate fitness professional dedicated to helping clients achieve their goals through personalized training programs.",
    certifications: ["NASM-CPT", "Nutrition Specialist"],
    specialties: ["Weight Loss", "Strength Training", "Functional Fitness"],
    stats: {
      clients: "50+",
      experience: "5 Years",
      rating: "4.9",
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Generation Modal */}
      <Dialog open={showGenerationModal} onOpenChange={setShowGenerationModal}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={() => setShowGenerationModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="text-center py-8">
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-[#D2FF28] rounded-full animate-ping opacity-75"></div>
                <div className="relative text-black">{generationSteps[currentStep]?.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">AI is Creating Your Website</h3>
              <p className="text-[#D2FF28] font-medium text-lg mb-2">{generationSteps[currentStep]?.message}</p>
              <p className="text-gray-600 text-sm">{generationSteps[currentStep]?.description}</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div
                className="bg-[#D2FF28] h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / generationSteps.length) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-3">
              {generationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    index <= currentStep ? "bg-[#D2FF28]/10" : ""
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-[#D2FF28]" />
                  ) : index === currentStep ? (
                    <Clock className="w-5 h-5 animate-spin text-[#D2FF28]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span className={`text-sm font-medium ${index <= currentStep ? "text-black" : "text-gray-400"}`}>
                    {step.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Pay Button - only shows when generation is complete and payment not completed */}
      {isGenerated && !showPaymentModal && !paymentCompleted && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 shadow-lg text-lg px-8 py-6 rounded-full"
            size="lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay €29
          </Button>
        </div>
      )}

      {/* Payment Modal with Stripe Integration */}
      {showPaymentModal && (
        <PaymentModal
          triggerText="Pay €29"
          amount="29.00"
          description="Professional Trainer Website - AI Generated Profile"
          planName="Trainer Website"
          onPaymentComplete={handlePaymentComplete}
          children={<div />}
        />
      )}

      {/* Success Message after Payment */}
      {paymentCompleted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your trainer profile is now live and ready to attract clients.</p>
              <p className="text-sm text-gray-500 mb-6">
                You'll receive a confirmation email with your unique profile URL shortly.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90"
              >
                View Your Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview of the Generated Trainer Page */}
      <div className={`${isGenerated ? "" : "pointer-events-none opacity-50"}`}>
        {/* Hero Section */}
        <section className="relative bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-[#D2FF28] text-black">
                  <Star className="w-4 h-4 mr-2" />
                  Verified Trainer
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{trainerData.name}</h1>
                <p className="text-xl text-[#D2FF28] font-semibold mb-4">{trainerData.specialty}</p>
                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {trainerData.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {trainerData.experience}
                  </div>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">{trainerData.bio}</p>
                <div className="flex gap-4">
                  <Button className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">Book Session</Button>
                  <Button variant="outline">View Programs</Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img src="/images/lemon-trainer.png" alt={trainerData.name} className="w-full h-full object-cover" />
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D2FF28]">{trainerData.stats.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D2FF28]">{trainerData.stats.clients}</div>
                    <div className="text-sm text-gray-600">Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Specialties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainerData.specialties.map((specialty, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-6">
                    <Award className="w-12 h-12 text-[#D2FF28] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{specialty}</h3>
                    <p className="text-gray-600">Expert-level training and guidance</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {trainerData.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-lg py-2 px-4">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
