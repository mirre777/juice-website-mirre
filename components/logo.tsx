"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  isDarkBackground?: boolean
}

export function Logo({ className, isDarkBackground = false }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">J</span>
      </div>
      <span className={cn("text-xl font-bold", isDarkBackground ? "text-white" : "text-gray-900")}>Juice</span>
    </div>
  )
}
