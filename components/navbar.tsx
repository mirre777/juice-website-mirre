"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Logo } from "./logo"
import { UserToggle } from "./user-toggle"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { isCoach } = useTheme()
  const pathname = usePathname()

  // Determine if the navbar should be dark
  const isNavbarDark =
    pathname === "/marketplace" ||
    pathname === "/100trainers" ||
    pathname === "/findatrainer" ||
    pathname.startsWith("/client") ||
    (pathname !== "/download-juice-app" && !isCoach)

  const navbarBgClass = isNavbarDark ? "bg-black/95 border-zinc-800" : "bg-white/95 border-gray-200"

  const getTextColorClass = (isActive = false) => {
    if (isNavbarDark) {
      return isActive ? "text-juice" : "text-white hover:text-juice"
    } else {
      return isActive ? "text-juice" : "text-gray-700 hover:text-juice"
    }
  }

  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/findatrainer", label: "Find Trainers" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60",
        navbarBgClass,
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo isDarkBackground={isNavbarDark} className={getTextColorClass()} />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("transition-colors", getTextColorClass(pathname === item.href))}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <UserToggle />
          <Button
            className={cn(
              "hidden md:inline-flex",
              isCoach ? "trainer-gradient-btn" : "bg-juice text-juice-foreground hover:bg-juice/90",
            )}
            asChild
          >
            <Link href="https://app.juice.fitness/">{isCoach ? "Start now" : "Get Started"}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("md:hidden", getTextColorClass())}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg hover:text-juice transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="mt-4 bg-juice text-juice-foreground hover:bg-juice/90" asChild>
                  <Link href="https://app.juice.fitness/">Get Started</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
