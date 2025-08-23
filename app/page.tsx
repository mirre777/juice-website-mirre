"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { WaitlistForm } from "@/components/waitlist-form"
import { HomePageFeaturesSection } from "@/components/homepage-features-section"
import { HomePageHowItWorks } from "@/components/homepage-how-it-works"
import { PricingSectionWithPayment } from "@/components/pricing-section-with-payment"
import { BenefitsSection } from "@/components/benefits-section"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const { setIsCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")
  const waitlistRef = useRef<HTMLDivElement>(null)

  // Set to trainer mode
  useEffect(() => {
    setIsCoach(true)
  }, [setIsCoach])

  const handleWaitlistClick = () => {
    setShowWaitlist(true)
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleMobileAppClick = () => {
    // Navigate to client page and scroll to how-it-works
    window.location.href = "/clients#how-it-works"
  }

  const handleWebAppClick = () => {
    window.location.href = "/workout-planner"
  }

  const handleWebpageBuilderClick = () => {
    window.location.href = "/marketplace/personal-trainer-website"
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-16 md:pt-[100px]">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-medium text-gray-600 tracking-wide">
              All-in-One Platform for Personal Trainers
            </h2>
          </div>

          <h1 className="mb-6 max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="text-6xl font-bold tracking-tight text-black md:w-1/2">Get new clients.</div>
              <div className="font-bold tracking-tight juice-text-gradient md:w-1/2 text-6xl">And keep them.</div>
            </div>
          </h1>

          <div className="mb-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Webpage Builder */}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105 pl-2.5"
                  onClick={handleWebpageBuilderClick}
                >
                  <Image
                    src="/images/homepage/microsite-alex.png"
                    alt="Personal trainer website builder"
                    width={400}
                    height={300}
                    className="w-full max-w-lg h-auto rounded-xl shadow-lg"
                  />
                </div>
                <div className="text-left">
                  <h3
                    className="text-lg font-semibold text-black cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-start gap-1"
                    onClick={handleWebpageBuilderClick}
                  >
                    Webpage Builder
                    <ChevronRight className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Attract new clients through your personal page</p>
                </div>
              </div>

              {/* Web App */}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  onClick={handleWebAppClick}
                >
                  <video
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DEMO%20convert%20a%20workout%20program%20from%20google%20sheets%20into%20client%20mobile%20app-CUUp6nXO3X3CGsUHIAuJFq9BsQklhB.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-lg h-auto rounded-xl shadow-lg"
                    width={400}
                    height={300}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="text-left">
                  <h3
                    className="text-lg font-semibold text-black cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-start gap-1"
                    onClick={handleWebAppClick}
                  >
                    Web App
                    <ChevronRight className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Convert your sheets to programs</p>
                </div>
              </div>

              {/* Mobile App */}
              <div className="flex flex-col items-center space-y-4 pr-2.5">
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  onClick={handleMobileAppClick}
                >
                  <Image
                    src="/images/homepage/workoutprogram.png"
                    alt="Mobile workout tracking app"
                    width={240}
                    height={520}
                    className="w-40 h-auto"
                  />
                </div>
                <div className="text-left">
                  <h3
                    className="text-lg font-semibold text-black cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-start gap-1"
                    onClick={handleMobileAppClick}
                  >
                    Mobile App
                    <ChevronRight className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Your client can easily do the workouts you shared</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <section id="benefits" className="scroll-mt-20 mt-16">
            <BenefitsSection />
          </section>

          {/* Features Section */}
          <section id="features" className="scroll-mt-20 mt-16">
            <HomePageFeaturesSection />
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="scroll-mt-20 mt-16">
            <HomePageHowItWorks />
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="scroll-mt-20 mt-16">
            <PricingSectionWithPayment />
          </section>

          {/* Waitlist Section */}
          {showWaitlist && (
            <section id="waitlist" ref={waitlistRef} className="scroll-mt-20 mt-16">
              <WaitlistForm />
            </section>
          )}

          <Footer />
        </div>
      </section>
    </main>
  )
}
