"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { BenefitsSection } from "@/components/benefits-section"
import { scrollToSection } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter, usePathname } from "next/navigation"
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

      {/* Footer */}
      <Footer />
    </div>
  )
}
