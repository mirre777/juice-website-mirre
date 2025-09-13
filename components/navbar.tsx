"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

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

    const currentHash = window.location.hash

    if (newIsCoach) {
      // Switching to trainer - navigate to root if on clients page
      if (pathname === "/clients" || pathname === "/for-clients") {
        router.push("/" + currentHash)
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
        router.push("/clients" + currentHash)
      }
    }
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()

    trackEvent("navigation_click", {
      section: "pricing",
      user_type: isCoach ? "trainer" : "client",
      location: "navbar",
    })

    const pagesWithPricing = ["/", "/trainers", "/for-trainers", "/personal-trainer-app"]
    const currentPageHasSection = pagesWithPricing.includes(pathname)

    if (currentPageHasSection) {
      // We're on a page that has the pricing section, scroll to it
      const pricingElement = document.getElementById("pricing")
      if (pricingElement) {
        pricingElement.scrollIntoView({ behavior: "smooth" })
      }
      window.history.pushState(null, "", "/#pricing")
    } else {
      // We're on a different page, redirect to homepage with anchor
      router.push("/#pricing")
    }
  }

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault()

    trackEvent("navigation_click", {
      section: "how-it-works",
      user_type: isCoach ? "trainer" : "client",
      location: "navbar",
    })

    const pagesWithHowItWorks = ["/", "/clients"]
    const currentPageHasSection = pagesWithHowItWorks.includes(pathname)

    if (isCoach) {
      if (currentPageHasSection) {
        // We're on a page that has the section, scroll to it
        const howItWorksElement = document.getElementById("how-it-works")
        if (howItWorksElement) {
          howItWorksElement.scrollIntoView({ behavior: "smooth" })
        }
        window.history.pushState(null, "", "/#how-it-works")
      } else {
        // We're on a different page, redirect to homepage with anchor
        router.push("/#how-it-works")
      }
    } else {
      if (currentPageHasSection) {
        // We're on a page that has the section, scroll to it
        const howItWorksElement = document.getElementById("how-it-works")
        if (howItWorksElement) {
          howItWorksElement.scrollIntoView({ behavior: "smooth" })
        }
        window.history.pushState(null, "", "/clients#how-it-works")
      } else {
        // We're on a different page, redirect to clients page with anchor
        router.push("/clients#how-it-works")
      }
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
    pathname === "/clients" || // Clients page gets dark navbar to match client-focused styling
    pathname === "/legal" // Added legal page for dark navbar to match black background

  const isWorkoutProgramPage = pathname.includes("/workout-programs/")
  const shouldUseWhiteNavbar = isWorkoutProgramPage || !isNavbarDark

  const linkTextColorClass = shouldUseWhiteNavbar ? "text-black" : "text-white"

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b ${shouldUseWhiteNavbar ? "bg-white border-gray-200" : "bg-black border-gray-800"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo isDarkBackground={!shouldUseWhiteNavbar} />
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
                onClick={() =>
                  trackEvent("navigation_click", {
                    section: "download-app",
                    user_type: isCoach ? "trainer" : "client",
                    location: "navbar",
                  })
                }
              >
                Download Workout App
              </Link>
              {isCoach && (
                <Link
                  href="/workout-planner"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                  onClick={() =>
                    trackEvent("navigation_click", {
                      section: "workout-planner",
                      user_type: "trainer",
                      location: "navbar",
                    })
                  }
                >
                  Online Workout Planner
                </Link>
              )}
              {!isCoach ? (
                <Link
                  href="/findatrainer"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                  onClick={() =>
                    trackEvent("navigation_click", {
                      section: "find-trainer",
                      user_type: "client",
                      location: "navbar",
                    })
                  }
                >
                  Find A Trainer
                </Link>
              ) : (
                <Link
                  href="/getclients"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                  onClick={() =>
                    trackEvent("navigation_click", {
                      section: "get-clients",
                      user_type: "trainer",
                      location: "navbar",
                    })
                  }
                >
                  Get Clients
                </Link>
              )}
            </div>
          </div>

          {/* User Toggle and CTA - Fixed spacing */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex-shrink-0">
              <UserToggle isCoach={isCoach} onChange={handleToggleChange} isDarkBackground={!shouldUseWhiteNavbar} />
            </div>
            <div className="flex-shrink-0">
              {isCoach ? (
                <Link
                  href="https://app.juice.fitness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #d2ff28 0%, #9acd32 50%, #7cb342 100%) !important",
                    color: "#ffffff !important",
                    fontWeight: "600 !important",
                    backgroundColor: "#9acd32 !important",
                    border: "2px solid #d2ff28 !important",
                  }}
                  onClick={() =>
                    trackEvent("cta_click", {
                      button_text: "Start now",
                      user_type: "trainer",
                      location: "navbar",
                    })
                  }
                >
                  Start now
                </Link>
              ) : (
                <Link
                  href="/download-juice-app"
                  className="px-4 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #d2ff28 0%, #9acd32 50%, #7cb342 100%) !important",
                    color: "#ffffff !important",
                    fontWeight: "600 !important",
                    backgroundColor: "#9acd32 !important",
                    border: "2px solid #d2ff28 !important",
                  }}
                  onClick={() =>
                    trackEvent("cta_click", {
                      button_text: "Download App",
                      user_type: "client",
                      location: "navbar",
                    })
                  }
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
          className={`md:hidden ${shouldUseWhiteNavbar ? "bg-white" : "bg-black"} border-t ${shouldUseWhiteNavbar ? "border-gray-200" : "border-gray-800"}`}
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
              onClick={() => {
                setIsMobileMenuOpen(false)
                trackEvent("navigation_click", {
                  section: "download-app",
                  user_type: isCoach ? "trainer" : "client",
                  location: "mobile-menu",
                })
              }}
            >
              Download Workout App
            </Link>
            {isCoach && (
              <Link
                href="/workout-planner"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  // Add click tracking for mobile menu workout planner link
                  trackEvent("navigation_click", {
                    section: "workout-planner",
                    user_type: "trainer",
                    location: "mobile-menu",
                  })
                }}
              >
                Online Workout Planner
              </Link>
            )}
            {!isCoach ? (
              <Link
                href="/findatrainer"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-600 rounded-md ${linkTextColorClass}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  // Add click tracking for mobile menu find trainer link
                  trackEvent("navigation_click", {
                    section: "find-trainer",
                    user_type: "client",
                    location: "mobile-menu",
                  })
                }}
              >
                Find A Trainer
              </Link>
            ) : (
              <Link
                href="/getclients"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-600 rounded-md ${linkTextColorClass}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  // Add click tracking for mobile menu get clients link
                  trackEvent("navigation_click", {
                    section: "get-clients",
                    user_type: "trainer",
                    location: "mobile-menu",
                  })
                }}
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
