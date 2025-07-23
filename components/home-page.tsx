"use client"

import { useEffect } from "react"

import { useRef } from "react"

import type React from "react"
import { useState } from "react"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { BenefitsSection } from "@/components/benefits-section"
import { scrollToSection } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link" // Import Link
import { HeroSection } from "@/components/hero-section"
import { CTASection } from "@/components/cta-section"

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
    <div className="min-h-screen bg-white">
      {/* Navigation - Floating Header */}
      <Navbar isHomePage={true} />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <CTASection />
      </main>

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

      {/* Footer */}
      <Footer />
    </div>
  )
}
