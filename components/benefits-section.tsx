"use client"

import { motion } from "framer-motion"
import { Check, Shield, Clock, Award } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function BenefitsSection() {
  const { isCoach } = useTheme()

  // If not in coach view, don't render anything
  if (!isCoach) {
    return null
  }

  return (
    <div className={`pb-0 pt-0 ${isCoach ? "bg-white" : "bg-black"}`}>
      
    </div>
  )
}
