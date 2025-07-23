"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { isCoach } = useTheme()

  return (
    <footer
      className={`${isCoach ? "bg-white" : "bg-black"} border-t ${isCoach ? "border-gray-200" : "border-zinc-800"} py-12 mt-16`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-md`}>
              The all-in-one platform for personal trainers and fitness enthusiasts to track progress, manage workouts,
              and achieve goals together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${isCoach ? "text-black" : "text-white"}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className={`font-semibold mb-4 ${isCoach ? "text-black" : "text-white"}`}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className={`${isCoach ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${isCoach ? "border-gray-200" : "border-zinc-800"} text-center`}>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>© 2024 Juice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
