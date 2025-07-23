"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider as CustomThemeProvider } from "@/contexts/theme-context"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  )
}
