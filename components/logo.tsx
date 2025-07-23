"use client"

import Image from "next/image"
import { useTheme } from "@/components/theme-provider"

export function Logo() {
  const { isCoach } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={isCoach ? "/images/juiceNewLogoPrime.png" : "/images/juiceNewLogoPrimeWhite.png"}
        alt="Juice Logo"
        width={120}
        height={40}
        className="h-8 w-auto"
      />
    </div>
  )
}
