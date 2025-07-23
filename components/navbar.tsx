"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { useTheme } from "@/components/theme-provider"

interface NavbarProps {
  isHomePage?: boolean
}

export function Navbar({ isHomePage = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isCoach } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Find Trainers", href: "/findatrainer" },
    { name: "About", href: "/about" },
  ]

  const isNavbarDark = !isCoach

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? isNavbarDark
            ? "bg-black/95 backdrop-blur-sm border-b border-white/10"
            : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo isDark={isNavbarDark} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? isNavbarDark
                        ? "text-juice"
                        : "text-juice"
                      : isNavbarDark
                        ? "text-white hover:text-juice"
                        : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <UserToggle />
            <Button
              asChild
              className={`${
                isNavbarDark ? "bg-juice text-black hover:bg-juice/90" : "bg-juice text-black hover:bg-juice/90"
              }`}
            >
              <Link href="https://app.juice.fitness/">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={isNavbarDark ? "text-white hover:text-juice" : "text-gray-700 hover:text-gray-900"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
                isNavbarDark ? "bg-black/95" : "bg-white/95"
              } backdrop-blur-sm border-t ${isNavbarDark ? "border-white/10" : "border-gray-200"}`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    pathname === item.href
                      ? isNavbarDark
                        ? "text-juice"
                        : "text-juice"
                      : isNavbarDark
                        ? "text-white hover:text-juice"
                        : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <UserToggle />
              </div>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-juice text-black hover:bg-juice/90">
                  <Link href="https://app.juice.fitness/">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
