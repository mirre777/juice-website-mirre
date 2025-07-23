"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { UserToggle } from "@/components/user-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Blog
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
          </nav>
        </div>
        <Button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="radix-:R16u6la:"
          data-state={isMenuOpen ? "open" : "closed"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="md:hidden">
              <Logo />
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <UserToggle />
            <Button asChild size="sm" className="px-4">
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-b md:hidden">
          <nav className="flex flex-col space-y-3 p-4">
            <Link
              href="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </nav>
  )
}
