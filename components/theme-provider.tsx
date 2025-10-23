"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type ThemeContextType = {
  isCoach: boolean
  setIsCoach: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: ReactNode }) {
  // Changed the default value to true to make coach mode the default
  const [isCoach, setIsCoach] = useState(true)

  // Apply body class based on isCoach state
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (isCoach) {
          document.body.classList.add("coach-mode")
          document.body.classList.remove("client-mode")
        } else {
          document.body.classList.add("client-mode")
          document.body.classList.remove("coach-mode")
        }
      })
    }
  }, [isCoach])

  return (
    <ThemeContext.Provider value={{ isCoach, setIsCoach }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
