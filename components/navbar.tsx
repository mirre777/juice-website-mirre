"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  isHomePage?: boolean
}

export function Navbar({ isHomePage = false }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isCoach } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Find Trainers", href: "/findatrainer" },
    { name: "About", href: "/about" },
  ]

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHomePage
            ? `${isCoach ? "bg-white/95 backdrop-blur-sm border-b border-gray-200" : "bg-black/95 backdrop-blur-sm border-b border-zinc-800"}`
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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                    pathname === item.href ? "text-orange-500" : isCoach ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side items */}
            <div className="hidden md:flex items-center space-x-4">
              <UserToggle />
              <Button
                onClick={() => window.open("https://app.juice.fitness/", "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md ${
                isCoach ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-zinc-800"
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${isCoach ? "bg-white border-gray-200" : "bg-black border-zinc-800"}`}>
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left text-sm font-medium transition-colors hover:text-orange-500 ${
                    pathname === item.href ? "text-orange-500" : isCoach ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <UserToggle />
                <Button
                  onClick={() => window.open("https://app.juice.fitness/", "_blank")}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
