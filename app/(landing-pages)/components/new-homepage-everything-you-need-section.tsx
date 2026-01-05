"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Feature {
  number: number
  headline: string
  subtitle?: string
  description: string
  ctaText: string
  ctaLink: string
  imageUrl: string
}

interface EverythingYouNeedSectionProps {
  features: Feature[]
}

export function EverythingYouNeedSection({ features }: EverythingYouNeedSectionProps) {
  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[36px] font-semibold text-center mb-12 font-inter">
          Everything You Need to Succeed
        </h2>

        <div className="space-y-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center py-12 md:py-16 ${
                index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
              }`}
            >
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-transparent border-2 border-black text-black flex items-center justify-center text-xl font-bold flex-shrink-0 font-sen rounded-lg">
                    {feature.number}
                  </div>
                  <h3 className="text-[30px] font-semibold font-sen">{feature.headline}</h3>
                </div>
                {feature.subtitle && (
                  <p className="text-[16px] text-gray-600 mb-4 font-inter font-semibold">{feature.subtitle}</p>
                )}
                <p className="text-[20px] text-gray-600 mb-6 font-inter font-normal leading-relaxed">{feature.description}</p>
                <a
                  href={feature.ctaLink}
                  className="inline-flex items-center gap-2 bg-juice text-black px-6 py-3 rounded-full text-[18px] font-semibold hover:opacity-90 transition-opacity font-inter"
                >
                  {feature.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.headline}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

