"use client"

import type { FC } from "react"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  isDarkBackground?: boolean // Add this prop
}

export const Logo: FC<LogoProps> = ({ className = "", isDarkBackground = false }) => {
  const { isCoach } = useTheme()
  // Always use the primary (black) logo, and invert it if the background is dark
  const logoSrc = "/images/juiceNewLogoPrime.png"
  const textColorClass = isDarkBackground ? "text-white" : "text-black"
  const imageFilterClass = isDarkBackground ? "invert" : "" // Tailwind's invert class

  return (
    <>
      <div className={cn("flex items-center gap-3 cursor-pointer", className)}>
        <div className="relative w-6 h-8 sm:w-8 sm:h-10">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="Juice Logo"
            width={24}
            height={32}
            className={cn("object-contain sm:w-8 sm:h-10", imageFilterClass)} // Apply invert class here
          />
        </div>
        <span className={cn("text-xl font-bold ml-3 sm:ml-4 hidden sm:block", textColorClass, className)}>juice</span>
      </div>
    </>
  )
}
