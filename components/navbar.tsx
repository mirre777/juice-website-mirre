"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { scrollToSection } from "@/lib/utils"

interface NavbarProps {
  isHomePage?: boolean
}

export function Navbar({ isHomePage = false }: NavbarProps) {
  const { isCoach } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#benefits", label: "Benefits" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? isCoach
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-zinc-900/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage &&
              navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href.substring(1))}
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                    isCoach ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isCoach ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Blog
            </Link>
          </div>

          {/* User Toggle and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <UserToggle />
            <Button
              className={`${
                isCoach
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isCoach ? "Start Free Trial" : "Get Started"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <UserToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${isCoach ? "text-gray-700" : "text-gray-300"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden absolute top-16 left-0 right-0 ${
              isCoach ? "bg-white" : "bg-zinc-900"
            } border-t shadow-lg`}
          >
            <div className="px-4 py-6 space-y-4">
              {isHomePage &&
                navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href.substring(1))}
                    className={`block text-base font-medium transition-colors hover:text-orange-500 ${
                      isCoach ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              <Link
                href="/blog"
                className={`block text-base font-medium transition-colors hover:text-orange-500 ${
                  isCoach ? "text-gray-700" : "text-gray-300"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Button
                className={`w-full ${
                  isCoach
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {isCoach ? "Start Free Trial" : "Get Started"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
