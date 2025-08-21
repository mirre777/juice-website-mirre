"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { WaitlistForm } from "@/components/waitlist-form"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSectionWithPayment } from "@/components/pricing-section-with-payment"
import { BenefitsSection } from "@/components/benefits-section"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function TrainerHomePage() {
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
    window.location.href = "/for-clients#how-it-works"
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-10 md:pb-10 md:pt-[100px]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">The #1 Personal Trainer Tool</h2>
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
                <div className="relative">
                  <Image
                    src="/images/homepage/microsite-alex.png"
                    alt="Personal trainer website builder"
                    width={400}
                    height={300}
                    className="w-full max-w-lg h-auto rounded-xl shadow-lg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black">Webpage Builder</h3>
                  <p className="text-sm text-gray-600">Attract new clients through your personal page</p>
                </div>
              </div>

              {/* Web App */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
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
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black">Web App</h3>
                  <p className="text-sm text-gray-600">Convert your sheets to programs</p>
                </div>
              </div>

              {/* Mobile App */}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  onClick={handleMobileAppClick}
                >
                  <Image
                    src="/images/homepage/workoutprogram.png"
                    alt="Mobile workout tracking app"
                    width={240}
                    height={520}
                    className="w-48 h-auto"
                  />
                </div>
                <div className="text-center">
                  <h3
                    className="text-lg font-semibold text-black cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-1"
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

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every
            PR—all in one easy-to-use platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={() => (window.location.href = "https://app.juice.fitness/")}
              className="rounded-full px-6 py-3 font-medium bg-black text-white transition-colors"
            >
              Start now
            </button>
            <button
              onClick={handleWaitlistClick}
              className="rounded-full px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Get updates
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2 mb-16">
            No credit card required. No lock-in. Works with Google Sheets.
          </p>

          {/* Waitlist Form */}
          {showWaitlist && (
            <div ref={waitlistRef} className="max-w-md mx-auto mb-16 animate-fadeIn">
              <div className="bg-white border-2 border-[#D2FF28] rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-100 py-3 px-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-black">Get early access. Join the waitlist.</h3>
                  </div>
                </div>
                <div className="p-4">
                  <WaitlistForm selectedPlan={selectedPlan} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 mt-24">
        <FeaturesSection />
      </section>

      {/* Dashboard Image Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full overflow-hidden">
              <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-03%20at%2012.39.50-cfIFHS6YKyNnMPuAhh0sXLnLmHeabm.png"
                  alt="Juice Dashboard Interface for Coaches"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-xl text-gray-600 mt-6 text-center">Because trainers should train, not juggle admin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 mt-24">
        <HowItWorks />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 mt-24">
        <PricingSectionWithPayment />
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center mt-24">
        <div className="w-2/3 h-2 bg-juice"></div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="scroll-mt-20 mt-24">
        <BenefitsSection />
      </section>

      {/* Blog Call to Action Section */}
      <section className="py-16 mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl p-8 md:p-12 shadow-lg text-center bg-gray-50">
            <h2 className="text-3xl font-bold mb-4 text-black">Stay Updated with the Juice Blog</h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover insights, tips, and the latest trends in fitness coaching and technology.
            </p>
            <Link href="/blog">
              <button className="rounded-full px-6 py-3 font-medium bg-white text-black border border-black transition-colors hover:bg-gray-100">
                Go go gadget blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-black">Best coaching app for personal trainers</h2>
            <p className="text-xl text-gray-600 mb-8">Ready to transform your coaching business?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "https://app.juice.fitness/")}
                className="rounded-full px-6 py-3 font-medium bg-black text-white transition-colors"
              >
                Start now
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required. No lock-in. Works with Google Sheets.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
