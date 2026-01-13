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
import { TestimonialsSection } from "@/app/(landing-pages)/components/homepage/new-homepage-testimonials-section"
import { trainerTestimonials } from "@/app/(landing-pages)/utils/new-homepage-data"
import { X } from "lucide-react"

export function PersonalTrainerAppClientPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCoach, setIsCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")
  const waitlistRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const handleWaitlistClick = () => {
    setShowWaitlist(true)

    // Wait for state to update and DOM to render before scrolling
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
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

  useEffect(() => {
    setIsCoach(true)
  }, [setIsCoach])

  // Handle escape key to close mobile menu and video modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
        setShowVideoModal(false)
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
      <section className="pt-20 pb-16 md:pb-16 md:pt-[100px]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-20">
            {/* Left side - Text content */}
            <div className="flex-1 text-left">
              <h1 className="mb-4 md:mb-6">
                {isCoach ? (
                  <div className="flex flex-col space-y-1 md:space-y-2">
                    <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                      Kill the hassle.
                    </span>
                    <span className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold tracking-tight juice-text-gradient pb-2 md:pb-4">
                      Keep the gains.
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold tracking-tight">
                    Simplify <span className="text-[#D2FF28]">Training.</span>
                  </span>
                )}
              </h1>
              <p
                className={`text-lg md:text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-8 md:mb-10 max-w-2xl`}
              >
                {isCoach ? (
                  <>
                    Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate
                    every PR—all in one easy-to-use platform.
                  </>
                ) : (
                  <>Super simple workout logging. Get insights into your training. Share your workouts.</>
                )}
              </p>
              {isCoach ? (
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button
                    onClick={() => (window.location.href = "https://app.juice.fitness/")}
                    className="rounded-full px-6 py-3 font-medium trainer-gradient-btn transition-colors"
                    id="early_access_trainer_hero"
                  >
                    Start now
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-6 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
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
                <p className="text-sm text-gray-500 mt-2">
                  No credit card required. No lock-in. Works with Google Sheets.
                </p>
              )}
            </div>

            {/* Right side - Video with fallback image */}
            {isCoach && (
              <div className="flex-1 lg:flex-[1.2]">
                <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden shadow-lg cursor-pointer group">
                  <video
                    src="https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/productdemo%20%281%29.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-auto"
                    onClick={() => setShowVideoModal(true)}
                    poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-03%20at%2012.39.50-cfIFHS6YKyNnMPuAhh0sXLnLmHeabm.png"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Waitlist Form */}
          {showWaitlist && (
            <div ref={waitlistRef} className="max-w-md mt-16 animate-fadeIn">
              <div
                className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-2 border-[#D2FF28] rounded-xl overflow-hidden shadow-lg`}
              >
                <div className={`${isCoach ? "bg-gray-100" : "bg-zinc-800"} py-3 px-4`}>
                  <div className="text-left">
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

          {/* Client view mobile screens - only show if not coach */}
          {!isCoach && (
            <div className="max-w-6xl mx-auto mt-16">
              <div className="relative w-full overflow-hidden">
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
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 mb-20">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 mb-20">
        <HowItWorks />
      </section>

      {/* Testimonials Section */}
      <section className="scroll-mt-20 mb-20">
        <TestimonialsSection
          type="trainer"
          title="What Trainers Are Saying"
          testimonials={trainerTestimonials}
          cta={{
            text: "Start now",
            onClick: () => (window.location.href = "https://app.juice.fitness/"),
            subText: "No credit card required. Get started in minutes.",
          }}
        />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 mb-20">
        <PricingSectionWithPayment />
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center mb-20">
        <div className="w-2/3 h-2 bg-juice"></div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="scroll-mt-20 mb-20">
        <BenefitsSection />
      </section>

      {/* Blog Call to Action Section */}
      <section className="py-16 mb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`rounded-3xl p-8 md:p-12 shadow-lg ${isCoach ? "bg-gray-50" : "bg-zinc-900"}`}>
            <h2 className={`text-3xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
              Stay Updated with the Juice Blog
            </h2>
            <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-8`}>
              Discover insights, tips, and the latest trends in fitness coaching and technology.
            </p>
            <Link href="/blog">
              <button
                className={`rounded-full px-6 py-3 font-medium bg-white text-black border border-black transition-colors hover:bg-gray-100`}
              >
                Go go gadget blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 mb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
              {isCoach ? "Best coaching app for personal trainers" : "Get ready to train."}
            </h2>
            <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-8`}>
              {isCoach
                ? "Ready to transform your coaching business?"
                : "Join thousands of bicep babes who are elevating their training with Juice."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src="https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/productdemo%20%281%29.mp4"
              controls
              autoPlay
              className="w-full h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}
