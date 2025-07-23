"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextType {
  isCoach: boolean
  setIsCoach: (isCoach: boolean) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ExtendedThemeProviderProps) {
  const [isCoach, setIsCoach] = React.useState(false)

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ isCoach, setIsCoach }}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
