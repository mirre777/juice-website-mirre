"use client"

import { motion } from "framer-motion"
import { Users, Gift, CheckCircle, Clock } from "lucide-react"

interface Statistic {
  number: string
  label: string
  icon?: React.ReactNode
}

interface StatisticsSectionProps {
  statistics: Statistic[]
}

// Icon mapping based on label
const getIcon = (label: string) => {
  if (label.toLowerCase().includes("trainer") || label.toLowerCase().includes("elite")) {
    return <Users className="w-8 h-8 text-black" />
  }
  if (label.toLowerCase().includes("free") || label.toLowerCase().includes("client")) {
    return <Gift className="w-8 h-8 text-black" />
  }
  if (label.toLowerCase().includes("flexibility") || label.toLowerCase().includes("100%")) {
    return <CheckCircle className="w-8 h-8 text-black" />
  }
  if (label.toLowerCase().includes("support") || label.toLowerCase().includes("24/7")) {
    return <Clock className="w-8 h-8 text-black" />
  }
  return null
}

export function StatisticsSection({ statistics }: StatisticsSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-juice">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {statistics.map((stat, index) => {
            const icon = stat.icon || getIcon(stat.label)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                {icon && <div className="flex justify-center mb-3">{icon}</div>}
                <div className="text-4xl md:text-5xl font-bold text-black mb-2 font-sen">{stat.number}</div>
                <div className="text-black text-sm md:text-base font-inter">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

