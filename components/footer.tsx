"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Logo } from "./logo"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Footer() {
  const { isCoach } = useTheme()
  const pathname = usePathname()

  // Determine if the footer background should be dark
  // It's dark if on marketplace or client routes, OR if it's client mode on other pages *except* download-juice-app, gratis-workout-app-met-trainer, trainingsplan-app-gratis, gratis-fitness-app-danmark, and best-free-workout-app-uk
  const isFooterDark =
    pathname === "/marketplace" ||
    pathname === "/100trainers" ||
    pathname === "/findatrainer" ||
    pathname === "/getclients" || // Added getclients route for dark footer
    pathname.startsWith("/client") ||
    (pathname !== "/download-juice-app" &&
      pathname !== "/gratis-workout-app-met-trainer" &&
      pathname !== "/trainingsplan-app-gratis" &&
      pathname !== "/gratis-fitness-app-danmark" &&
      pathname !== "/best-free-workout-app-uk" && // Added UK page path for white footer background
      !isCoach)

  const footerBgClass = isFooterDark ? "bg-black text-white" : "bg-gray-100 text-gray-800"

  const getTextColorClass = (isHeading = false) => {
    if (isFooterDark) {
      return isHeading ? "text-white" : "text-zinc-400 hover:text-white"
    } else {
      return isHeading ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
    }
  }

  return (
    <footer className={cn("py-[18px]", footerBgClass)}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo isDarkBackground={isFooterDark} className={getTextColorClass(true)} />
          </Link>
          <p className={cn("text-sm", getTextColorClass())}>Make every workout count.</p>
          <div className="flex space-x-4">
            <Link href="#" className={getTextColorClass()}>
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className={getTextColorClass()}>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className={getTextColorClass()}>
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className={getTextColorClass()}>
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className={cn("text-lg font-semibold mb-4", getTextColorClass(true))}>Product</h3>
          <ul className="space-y-2 text-left">
            <li>
              <Link href="#" className={cn("text-sm", getTextColorClass())}>
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className={cn("text-sm", getTextColorClass())}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className={cn("text-sm", getTextColorClass())}>
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="#" className={cn("text-sm", getTextColorClass())}>
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={cn("text-lg font-semibold mb-4", getTextColorClass(true))}>Company</h3>
          <ul className="space-y-2 text-left">
            <li>
              <Link href="/blog" className={cn("text-sm", getTextColorClass())}>
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={cn("text-lg font-semibold mb-4", getTextColorClass(true))}>Legal</h3>
          <ul className="space-y-2 text-left">
            <li>
              <Link href="/legal?tab=terms" className={cn("text-sm", getTextColorClass())}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal?tab=privacy" className={cn("text-sm", getTextColorClass())}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal?tab=cookie" className={cn("text-sm", getTextColorClass())}>
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/legal?tab=gdpr" className={cn("text-sm", getTextColorClass())}>
                GDPR
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
        <p className={cn("text-sm", getTextColorClass())}>
          &copy; {new Date().getFullYear()} Juice Fitness. All rights reserved.
        </p>
        <p className={cn("text-sm mt-2 sm:mt-0", getTextColorClass())}>Made with sweat in Vienna</p>
      </div>
    </footer>
  )
}

// Also export as default for compatibility
export default Footer
