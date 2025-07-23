"use client"

import { useTheme } from "@/contexts/theme-context"

export function Logo() {
  const { theme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      {theme === "coach" ? (
        <img src="/images/juiceNewLogoPrimeWhite.png" alt="Juice Logo" className="h-8 w-auto" />
      ) : (
        <img src="/images/juiceNewLogoPrime.png" alt="Juice Logo" className="h-8 w-auto" />
      )}
    </div>
  )
}
