"use client"

import Image from "next/image"

interface LogoProps {
  isDark?: boolean
  className?: string
}

export function Logo({ isDark = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={isDark ? "/images/juiceNewLogoPrimeWhite.png" : "/images/juiceNewLogoPrime.png"}
        alt="Juice"
        width={80}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </div>
  )
}
