"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { useTheme } from "@/contexts/theme-context"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { isCoach, setIsCoach } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isNavbarDark =
    (!isCoach &&
      pathname !== "/download-juice-app" &&
      pathname !== "/gratis-workout-app-met-trainer" &&
      pathname !== "/trainingsplan-app-gratis" &&
      pathname !== "/gratis-fitness-app-danmark" &&
      pathname !== "/best-free-workout-app-uk") || // Added UK page path for white navbar background
    pathname === "/marketplace" ||
    pathname === "/100trainers" ||
    pathname === "/findatrainer"
  const linkTextColorClass = isNavbarDark ? "text-white" : "text-black"

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b ${isNavbarDark ? "bg-black border-gray-800" : "bg-white border-gray-200"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/#how-it-works"
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                How It Works
              </Link>
              <Link
                href="/pricing-demo"
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                Pricing
              </Link>
              <Link
                href="/download-juice-app"
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                Download
              </Link>
              {isCoach && (
                <Link
                  href="/workout-planner"
                  className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
                >
                  Workout Planner
                </Link>
              )}
              <Link
                href="/marketplace"
                className={`px-3 py-2 text-sm font-medium hover:text-gray-600 transition-colors ${linkTextColorClass}`}
              >
                Marketplace
              </Link>
            </div>
          </div>

          {/* User Toggle and CTA - Fixed spacing */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex-shrink-0">
              <UserToggle isCoach={isCoach} onChange={setIsCoach} isDarkBackground={isNavbarDark} />
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
            <Link
              href="/#how-it-works"
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing-demo"
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/download-juice-app"
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Download
            </Link>
            {isCoach && (
              <Link
                href="/workout-planner"
                className={`block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md ${linkTextColorClass}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workout Planner
              </Link>
            )}
            <Link
              href="/marketplace"
              className={`block px-3 py-2 text-base font-medium hover:bg-gray-600 rounded-md ${linkTextColorClass}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
