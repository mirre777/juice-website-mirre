"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { isCoach } = useTheme()

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Blog", href: "/blog" },
      { name: "About", href: "/about" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy", href: "/legal" },
      { name: "Terms", href: "/legal" },
      { name: "Cookies", href: "/legal" },
    ],
  }

  return (
    <footer
      className={`${isCoach ? "bg-gray-50" : "bg-zinc-900"} border-t ${isCoach ? "border-gray-200" : "border-zinc-800"}`}
    >
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Logo isDark={!isCoach} />
            <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              {isCoach
                ? "The complete platform for personal trainers to manage clients, workouts, and grow their business."
                : "Simple, powerful fitness tracking for everyone."}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className={`font-semibold mb-4 ${isCoach ? "text-gray-900" : "text-white"}`}>Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isCoach ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className={`font-semibold mb-4 ${isCoach ? "text-gray-900" : "text-white"}`}>Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isCoach ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className={`font-semibold mb-4 ${isCoach ? "text-gray-900" : "text-white"}`}>Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isCoach ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`mt-8 pt-8 border-t ${isCoach ? "border-gray-200" : "border-zinc-800"} flex flex-col md:flex-row justify-between items-center`}
        >
          <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>© 2024 Juice. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="https://twitter.com/juicefitness"
              className={`text-sm transition-colors ${
                isCoach ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
            >
              Twitter
            </Link>
            <Link
              href="https://instagram.com/juicefitness"
              className={`text-sm transition-colors ${
                isCoach ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
