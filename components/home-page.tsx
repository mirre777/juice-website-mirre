"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { BenefitsSection } from "@/components/benefits-section"
import { AppDownloadSection } from "@/components/app-download-section"
import { scrollToSection } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link" // Import Link
import { HeroSection } from "@/components/hero-section"

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
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="scroll-mt-20">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20">
        <HowItWorks />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20">
        <PricingSection />
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center mt-8">
        <div className="w-2/3 h-2 bg-juice"></div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="scroll-mt-20">
        <BenefitsSection />
      </section>

      {/* App Download Section */}
      <AppDownloadSection />

      {/* Blog Call to Action Section */}
      <section className="py-16">
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
                className={`rounded-full px-6 py-3 font-medium bg-white text-black border border-black transition-colors hover:bg-gray-100`}
              >
                Go go gadget blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10">
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
                className="rounded-full px-6 py-3 font-medium bg-black text-white transition-colors"
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
