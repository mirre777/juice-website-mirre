"use client"
import Image from "next/image"

export function StatisticsScreen() {
  return (
    <div className="w-full h-full">
      <Image src="/images/iphone-statistics.svg" alt="Fitness Statistics Dashboard" fill className="object-contain" />
    </div>
  )
}
