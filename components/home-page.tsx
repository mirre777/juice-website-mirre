"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { WaitlistForm } from "@/components/waitlist-form"
import { ClientWaitlistForm } from "@/components/client-waitlist-form"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSectionWithPayment } from "@/components/pricing-section-with-payment"
import { BenefitsSection } from "@/components/benefits-section"
import { scrollToSection } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCoach, setIsCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")
  const waitlistRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleWaitlistClick = () => {
    setShowWaitlist(true)

    // Wait for state to update and DOM to render before scrolling
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleMobileAppClick = () => {
    // Set to client view first
    setIsCoach(false)
    // Then scroll to how-it-works section
    setTimeout(() => {
      scrollToSection("how-it-works")
    }, 100)
  }

  useEffect(() => {
    if (showWaitlist && waitlistRef.current) {
      waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [showWaitlist])

  // Handle hash links on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the hash from the URL (without the #)
      const hash = window.location.hash.substring(1)

      if (hash) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
          scrollToSection(hash)
        }, 500)
      }
    }
  }, [])

  // Check if we're on the client route and set view accordingly
  useEffect(() => {
    if (pathname === "/client") {
      setIsCoach(false)
    } else {
      setIsCoach(true)
    }
  }, [pathname, setIsCoach])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <main className={`min-h-screen ${isCoach ? "bg-white text-black" : "bg-black text-white"}`}>
      {/* Navigation - Floating Header */}
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-10 md:pt-40 md:pb-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="mb-6 max-w-4xl mx-auto text-center">
            {isCoach ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="text-6xl font-bold tracking-tight text-black md:w-1/2">
                  3 Things you need to get new clients.
                </div>
                <div className="font-bold tracking-tight juice-text-gradient md:w-1/2 text-8xl">And keep them.</div>
              </div>
            ) : (
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                Simplify <span className="text-[#D2FF28]">Training.</span>
              </span>
            )}
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
                  <h3 className={`text-lg font-semibold ${isCoach ? "text-black" : "text-white"}`}>Webpage Builder</h3>
                  <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    Attract new clients through your personal page
                  </p>
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
                  <h3 className={`text-lg font-semibold ${isCoach ? "text-black" : "text-white"}`}>Web App</h3>
                  <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    Convert your sheets to programs
                  </p>
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
                    className={`text-lg font-semibold ${isCoach ? "text-black" : "text-white"} cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-1`}
                    onClick={handleMobileAppClick}
                  >
                    Mobile App
                    <ChevronRight className="w-4 h-4" />
                  </h3>
                  <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    Your client can easily do the workouts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-10 max-w-3xl mx-auto`}>
            {isCoach ? (
              <>
                Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every
                PR—all in one easy-to-use platform.
              </>
            ) : (
              <>Super simple workout logging. Get insights into your training. Share your workouts.</>
            )}
          </p>
          {isCoach ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <button
                onClick={() => (window.location.href = "https://app.juice.fitness/")}
                className={`rounded-full px-6 py-3 font-medium transition-colors ${
                  isCoach ? "trainer-gradient-btn" : "client-gradient-btn"
                }`}
                id="early_access_trainer_hero"
              >
                Start now
              </button>
              <button
                onClick={handleWaitlistClick}
                className="rounded-full px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                id="get_updates_trainer"
              >
                Get updates
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mb-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_US-UK_RGB_blk.svg"
                    alt="Download on the App Store"
                    width={200}
                    height={60}
                    className="h-14 w-auto"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=fitness.beta.juice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    width={200}
                    height={60}
                    className="h-14 w-auto"
                  />
                </a>
              </div>
              <button
                onClick={handleWaitlistClick}
                className="rounded-full px-6 py-3 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                id="get_updates_client"
              >
                Get updates
              </button>
            </div>
          )}
          {/* Only show this line for trainer view */}
          {isCoach && (
            <p className="text-sm text-gray-500 mt-2 mb-16">
              No credit card required. No lock-in. Works with Google Sheets.
            </p>
          )}
          {/* Waitlist Form */}
          {showWaitlist && (
            <div ref={waitlistRef} className="max-w-md mx-auto mb-16 animate-fadeIn">
              <div
                className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-2 border-[#D2FF28] rounded-xl overflow-hidden shadow-lg`}
              >
                <div className={`${isCoach ? "bg-gray-100" : "bg-zinc-800"} py-3 px-4`}>
                  <div className="text-center">
                    <h3 className={`text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
                      Get early access. Join the waitlist.
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  {isCoach ? (
                    <WaitlistForm selectedPlan={selectedPlan} />
                  ) : (
                    <ClientWaitlistForm selectedPlan={selectedPlan} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full overflow-hidden">
              {isCoach ? (
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
              ) : (
                <div className="flex justify-center py-8">
                  <div className="flex justify-center items-center gap-4 overflow-x-auto pb-4">
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/import-program.png"
                        alt="Import workout program screen"
                        width={192}
                        height={416}
                        className="w-48 h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/workout-program.png"
                        alt="Workout program overview screen"
                        width={192}
                        height={416}
                        className="w-48 h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/workout-logging.png"
                        alt="Workout logging screen"
                        width={192}
                        height={416}
                        className="w-48 h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/statistics.png"
                        alt="Statistics and progress screen"
                        width={192}
                        height={416}
                        className="w-48 h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Moved this line to underneath the dashboard image */}
            {isCoach && (
              <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mt-6 text-center`}>
                Because trainers should train, not juggle admin.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 mt-24">
        <FeaturesSection />
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
          <div className={`rounded-3xl p-8 md:p-12 shadow-lg text-center ${isCoach ? "bg-gray-50" : "bg-zinc-900"}`}>
            <h2 className={`text-3xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
              Stay Updated with the Juice Blog
            </h2>
            <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-8`}>
              Discover insights, tips, and the latest trends in fitness coaching and technology.
            </p>
            <Link href="/blog">
              <button
                className={`rounded-full px-6 py-3 font-medium ${
                  isCoach ? "trainer-gradient-btn" : "client-gradient-btn"
                } transition-colors`}
              >
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
            <h2 className={`text-3xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
              {isCoach ? "Best coaching app for personal trainers" : "Get ready to train."}
            </h2>
            <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-8`}>
              {isCoach
                ? "Ready to transform your coaching business?"
                : "Join thousands of bicep babes who are elevating their training with Juice."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "https://app.juice.fitness/")}
                className={`rounded-full px-6 py-3 font-medium transition-colors ${
                  isCoach ? "trainer-gradient-btn" : "client-gradient-btn"
                }`}
                id={isCoach ? "early_access_trainer_bottom" : "early_access_client_bottom"}
              >
                Start now
              </button>
            </div>
            {/* Only show this line for trainer view */}
            {isCoach && (
              <p className="text-sm text-gray-500 mt-4">
                No credit card required. No lock-in. Works with Google Sheets.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
