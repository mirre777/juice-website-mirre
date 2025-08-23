"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCoach, setIsCoach } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (
      pathname === "/" ||
      pathname === "/trainers" ||
      pathname === "/for-trainers" ||
      pathname === "/personal-trainer-app"
    ) {
      setIsCoach(true)
    } else if (pathname === "/clients" || pathname === "/for-clients") {
      setIsCoach(false)
    }
  }, [pathname, setIsCoach])

  const handleToggleChange = (newIsCoach: boolean) => {
    setIsCoach(newIsCoach)
    if (newIsCoach) {
      // Switching to trainer - navigate to root if on clients page
      if (pathname === "/clients" || pathname === "/for-clients") {
        router.push("/")
      }
    } else {
      // Switching to client - navigate to clients if on root, trainers, trainer app pages, or download pages
      if (
        pathname === "/" ||
        pathname === "/trainers" ||
        pathname === "/for-trainers" ||
        pathname === "/personal-trainer-app" ||
        pathname === "/download-juice-app"
      ) {
        router.push("/clients")
      }
    }
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const pricingElement = document.getElementById("pricing")
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: "smooth" })
    }
    // Update URL after scrolling - use / for trainer homepage
    window.history.pushState(null, "", "/#pricing")
  }

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (isCoach) {
      const howItWorksElement = document.getElementById("how-it-works")
      if (howItWorksElement) {
        howItWorksElement.scrollIntoView({ behavior: "smooth" })
      }
      window.history.pushState(null, "", "/#how-it-works")
    } else {
      const howItWorksElement = document.getElementById("how-it-works")
      if (howItWorksElement) {
        howItWorksElement.scrollIntoView({ behavior: "smooth" })
      }
      window.history.pushState(null, "", "/clients#how-it-works")
    }
  }

  console.log("[v0] Navbar isCoach state:", isCoach)

  const isNavbarDark =
    (!isCoach &&
      pathname !== "/download-juice-app" &&
      pathname !== "/gratis-workout-app-met-trainer" &&
      pathname !== "/trainingsplan-app-gratis" &&
      pathname !== "/gratis-fitness-app-danmark" &&
      pathname !== "/best-free-workout-app-uk") || // Added UK page path for white navbar background
    pathname === "/marketplace" ||
    pathname === "/100trainers" ||
    pathname === "/findatrainer" ||
    pathname === "/getclients" || // Added getclients route for dark navbar
    pathname === "/clients" // Clients page gets dark navbar to match client-focused styling

  const linkTextColorClass = isNavbarDark ? "text-white" : "text-black"

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b ${isNavbarDark ? "bg-black border-gray-800" : "bg-white border-gray-200"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo isDarkBackground={isNavbarDark} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={handleHowItWorksClick}
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                How It Works
              </button>
              {isCoach && (
                <button
                  onClick={handlePricingClick}
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                >
                  Pricing
                </button>
              )}
              <Link
                href="/download-juice-app"
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                Download Workout App
              </Link>
              {isCoach && (
                <Link
                  href="/workout-planner"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                >
                  Online Workout Planner
                </Link>
              )}
              {!isCoach ? (
                <Link
                  href="/findatrainer"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                >
                  Find A Trainer
                </Link>
              ) : (
                <Link
                  href="/getclients"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                >
                  Get Clients
                </Link>
              )}
            </div>
          </div>

          {/* User Toggle and CTA - Fixed spacing */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex-shrink-0">
              <UserToggle isCoach={isCoach} onChange={handleToggleChange} isDarkBackground={isNavbarDark} />
            </div>
            <div className="flex-shrink-0">
              {isCoach ? (
                <Link
                  href="https://app.juice.fitness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trainer-gradient-btn px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Start now
                </Link>
              ) : (
                <Link
                  href="/download-juice-app"
                  className="trainer-gradient-btn px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Download App
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${linkTextColorClass}`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${isNavbarDark ? "bg-black" : "bg-white"} border-t ${isNavbarDark ? "border-gray-800" : "border-gray-200"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={(e) => {
                handleHowItWorksClick(e)
                setIsMobileMenuOpen(false)
              }}
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass} w-full text-left`}
            >
              How It Works
            </button>
            {isCoach && (
              <button
                onClick={(e) => {
                  handlePricingClick(e)
                  setIsMobileMenuOpen(false)
                }}
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass} w-full text-left`}
              >
                Pricing
              </button>
            )}
            <Link
              href="/download-juice-app"
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Download Workout App
            </Link>
            {isCoach && (
              <Link
                href="/workout-planner"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Online Workout Planner
              </Link>
            )}
            {!isCoach ? (
              <Link
                href="/findatrainer"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-600 rounded-md ${linkTextColorClass}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find A Trainer
              </Link>
            ) : (
              <Link
                href="/getclients"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-600 rounded-md ${linkTextColorClass}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Clients
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
