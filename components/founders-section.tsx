"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { motion } from "framer-motion"

interface FoundersSectionProps {
  imageUrl?: string
  onTryItClick?: () => void
  onDemoClick?: () => void
}

export function FoundersSection({ imageUrl, onTryItClick, onDemoClick }: FoundersSectionProps) {
  return (
    <section className="pt-12 md:pt-16 pb-16 md:pb-20 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[36px] font-semibold text-center mb-12 font-inter">Why We Built Juice</h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-gray-600 mb-8 font-inter">
                {/* Placeholder text - to be filled with actual content */}
                We built Juice because we believe trainers should focus on what they do best - training. Not spreadsheets,
                admin work, or juggling multiple tools.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
                {onTryItClick && (
                  <button
                    onClick={onTryItClick}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity font-inter"
                  >
                    Try it out. It's FREE!
                  </button>
                )}
                {onDemoClick && (
                  <button
                    onClick={onDemoClick}
                    className="bg-white border-2 border-black text-black px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center font-inter"
                  >
                    <Play className="w-4 h-4" />
                    Demo
                  </button>
                )}
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500 font-inter">No credit card required. Get started in minutes.</p>
            </div>

            {/* Founders Image */}
            {imageUrl && (
              <div className="flex-1 relative">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl}
                    alt="Founders"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay Text */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
                    <p className="text-2xl font-bold mb-2 font-sen">We Are The Founders</p>
                    <p className="text-lg font-inter">Ask Us Anything</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

