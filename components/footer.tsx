"use client"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/logo"

export function Footer() {
  const { isCoach } = useTheme()

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Blog", href: "/blog" },
      { name: "Find Trainers", href: "/findatrainer" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Legal", href: "/legal" },
    ],
    Resources: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "API Docs", href: "#" },
      { name: "Status", href: "#" },
    ],
  }

  return (
    <footer
      className={`${isCoach ? "bg-gray-50 border-t border-gray-200" : "bg-zinc-900 border-t border-zinc-800"} py-12`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <Logo />
            <p className={`mt-4 text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              The best coaching app for personal trainers and fitness enthusiasts.
            </p>
            <div className="flex space-x-4 mt-4">{/* Social media links would go here */}</div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className={`font-semibold mb-4 ${isCoach ? "text-black" : "text-white"}`}>{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors hover:text-orange-500 ${
                        isCoach ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 pt-8 border-t ${isCoach ? "border-gray-200" : "border-zinc-800"} flex flex-col md:flex-row justify-between items-center`}
        >
          <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>© 2024 Juice. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/legal"
              className={`text-sm transition-colors hover:text-orange-500 ${isCoach ? "text-gray-600" : "text-gray-400"}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal"
              className={`text-sm transition-colors hover:text-orange-500 ${isCoach ? "text-gray-600" : "text-gray-400"}`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
