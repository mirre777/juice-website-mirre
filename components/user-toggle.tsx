"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function UserToggle() {
  const { isCoach, setIsCoach } = useTheme()
  const pathname = usePathname()

  // Don't show toggle on certain pages
  if (
    pathname === "/marketplace" ||
    pathname === "/100trainers" ||
    pathname === "/findatrainer" ||
    pathname.startsWith("/client") ||
    pathname === "/download-juice-app"
  ) {
    return null
  }

  const isNavbarDark = !isCoach

  return (
    <div className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-1">
      <Button
        variant={!isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(false)}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-all",
          !isCoach
            ? "bg-juice text-black shadow-sm"
            : isNavbarDark
              ? "text-white hover:text-juice"
              : "text-gray-600 hover:text-gray-900",
        )}
      >
        Client
      </Button>
      <Button
        variant={isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(true)}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-all",
          isCoach
            ? "bg-juice text-black shadow-sm"
            : isNavbarDark
              ? "text-white hover:text-juice"
              : "text-gray-600 hover:text-gray-900",
        )}
      >
        Trainer
      </Button>
    </div>
  )
}
