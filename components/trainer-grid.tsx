"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TrainerGridProps {
  totalSpots: number
  filledSpots: number
}

export function TrainerGrid({ totalSpots, filledSpots }: TrainerGridProps) {
  const [animatedSpots, setAnimatedSpots] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSpots(filledSpots)
    }, 500)
    return () => clearTimeout(timer)
  }, [filledSpots])

  const handleGreyCircleClick = () => {
    const waitlistForm = document.getElementById("waitlist-form")
    if (waitlistForm) {
      waitlistForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  const spots = Array.from({ length: totalSpots }, (_, index) => {
    const isFilled = index < animatedSpots
    const isGrey = index >= filledSpots

    return (
      <motion.div
        key={index}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.01,
          ease: "easeOut",
        }}
        className={`
          w-8 h-8 rounded-full transition-all duration-300
          ${isFilled ? "bg-juice" : "bg-zinc-600"}
          ${isGrey ? "cursor-pointer" : ""}
        `}
        onClick={isGrey ? handleGreyCircleClick : undefined}
      />
    )
  })

  return (
    <div className="flex flex-col items-center mb-12">
      <div className="grid grid-cols-10 gap-1 max-w-lg mx-auto mb-6">{spots}</div>
      <div className="text-center">
        <p className="text-zinc-400 text-sm">
          <span className="text-juice font-semibold">{filledSpots}</span> spots taken •{" "}
          <span className="text-white font-semibold">{totalSpots - filledSpots}</span> spots remaining
        </p>
      </div>
    </div>
  )
}
