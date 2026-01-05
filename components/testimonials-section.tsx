"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface Testimonial {
  headline?: string
  quote: string
  name: string
  title: string
  location?: string
  imageUrl: string
  rating?: number
}

interface TestimonialsSectionProps {
  type: "trainer" | "client"
  title: string
  testimonials: Testimonial[]
  cta?: {
    text: string
    onClick: () => void
    subText?: string
  }
}

export function TestimonialsSection({ type, title, testimonials, cta }: TestimonialsSectionProps) {
  const defaultRating = 5

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[36px] font-semibold text-center mb-12 font-inter">{title}</h2>

        <div
          className={`grid grid-cols-1 ${
            testimonials.length === 2
              ? "md:grid-cols-2"
              : testimonials.length === 3
                ? "md:grid-cols-3"
                : testimonials.length === 4
                  ? "md:grid-cols-2 lg:grid-cols-4"
                  : "md:grid-cols-2 lg:grid-cols-4"
          } gap-6 md:gap-8 max-w-6xl mx-auto`}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-xl ${
                type === "client" 
                  ? "bg-white border border-gray-200 shadow-sm p-0 overflow-hidden" 
                  : "bg-[#F9FAFB] p-6"
              }`}
            >
              {type === "client" ? (
                // Client testimonial layout - full-width image with overlay
                <>
                  {/* Full-width image with name/location overlay */}
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {/* Name and location overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-lg font-inter">{testimonial.name}</p>
                      {testimonial.location && (
                        <p className="text-white/90 text-sm font-inter">{testimonial.location}</p>
                      )}
                    </div>
                  </div>
                  {/* Content below image */}
                  <div className="p-6">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating || defaultRating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-juice text-juice" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-gray-700 font-inter leading-relaxed">{testimonial.quote}</p>
                  </div>
                </>
              ) : (
                // Trainer testimonial layout - matching Figma design
                <>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating || defaultRating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-juice text-juice" />
                    ))}
                  </div>

                  {/* Headline - Roboto 16 bold */}
                  {testimonial.headline && (
                    <h3 className="text-[16px] font-bold text-black mb-3 font-roboto">{testimonial.headline}</h3>
                  )}

                  {/* Quote - Roboto 16 regular */}
                  <p className="text-[16px] text-gray-700 mb-6 font-roboto leading-relaxed">"{testimonial.quote}"</p>

                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-black font-roboto">{testimonial.name}</p>
                      <p className="text-[14px] text-gray-600 font-roboto">{testimonial.title}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        {cta && (
          <div className="flex flex-col items-center mt-8">
            <button
              onClick={cta.onClick}
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 font-inter"
            >
              {cta.text}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {cta.subText && (
              <p className="text-sm text-gray-500 mt-3 font-inter">{cta.subText}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

