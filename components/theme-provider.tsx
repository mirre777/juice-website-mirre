"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface ThemeContextType {
  isCoach: boolean
  setIsCoach: (isCoach: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isCoach, setIsCoach] = useState(true)

  return <ThemeContext.Provider value={{ isCoach, setIsCoach }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
