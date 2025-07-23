"use client"

import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/logo"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const { isCoach } = useTheme()

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Benefits", href: "#benefits" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/legal" },
      { name: "Terms of Service", href: "/legal" },
      { name: "Cookie Policy", href: "/legal" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/juiceapp" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/juiceapp" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/juiceapp" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/juiceapp" },
  ]

  return (
    <footer className={`${isCoach ? "bg-gray-900 text-white" : "bg-black text-white"} py-16`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              {isCoach
                ? "The all-in-one platform for fitness coaches to grow their business and manage clients effectively."
                : "Transform your fitness journey with expert coaching and personalized workout plans."}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Juice. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/legal" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Terms
            </Link>
            <Link href="/legal" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
