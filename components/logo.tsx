"use client"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"

export function Logo() {
  const { isCoach } = useTheme()

  return (
    <div className="flex items-center">
      <Image
        src={isCoach ? "/images/juiceNewLogoPrime.png" : "/images/juiceNewLogoPrimeWhite.png"}
        alt="Juice"
        width={100}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </div>
  )
}
