"use client"

// Re-export the useTheme hook from the theme-provider for backward compatibility
import { useTheme as useThemeFromProvider, ThemeProvider } from "@/components/theme-provider"

// Export the hook with the same name
export const useTheme = useThemeFromProvider

// Export the provider
export { ThemeProvider }
