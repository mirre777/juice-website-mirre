"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Star } from "lucide-react"

interface TrainerProfile {
  name: string
  imageUrl: string
}

interface NewHomepageHeroSectionProps {
  trainerProfiles: TrainerProfile[]
  laptopImageUrl: string
  phoneImageUrl: string
  onDemoClick?: () => void
  onStartFreeClick?: () => void
}

export function NewHomepageHeroSection({
  trainerProfiles,
  laptopImageUrl,
  phoneImageUrl,
  onDemoClick,
  onStartFreeClick,
}: NewHomepageHeroSectionProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (headlineRef.current) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/559f5179-eeb5-4a0c-8112-9781b1ba32f2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'new-homepage-hero-section.tsx:useEffect',message:'Headline dimensions and line count',data:{width:headlineRef.current.offsetWidth,height:headlineRef.current.offsetHeight,scrollHeight:headlineRef.current.scrollHeight,lineHeight:parseFloat(getComputedStyle(headlineRef.current).lineHeight),computedLineCount:Math.round(headlineRef.current.scrollHeight/parseFloat(getComputedStyle(headlineRef.current).lineHeight)),textContent:headlineRef.current.textContent?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/559f5179-eeb5-4a0c-8112-9781b1ba32f2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'new-homepage-hero-section.tsx:useEffect',message:'Parent container dimensions',data:{parentWidth:headlineRef.current.parentElement?.offsetWidth,parentMaxWidth:headlineRef.current.parentElement ? getComputedStyle(headlineRef.current.parentElement).maxWidth : null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/559f5179-eeb5-4a0c-8112-9781b1ba32f2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'new-homepage-hero-section.tsx:useEffect',message:'Computed styles affecting wrapping',data:{whiteSpace:getComputedStyle(headlineRef.current).whiteSpace,wordBreak:getComputedStyle(headlineRef.current).wordBreak,overflowWrap:getComputedStyle(headlineRef.current).overflowWrap,display:getComputedStyle(headlineRef.current).display},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/559f5179-eeb5-4a0c-8112-9781b1ba32f2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'new-homepage-hero-section.tsx:useEffect',message:'BR tag presence check',data:{innerHTML:headlineRef.current.innerHTML.includes('<br'),childNodes:Array.from(headlineRef.current.childNodes).map(n=>({type:n.nodeType,nodeName:n.nodeName,textContent:n.textContent?.substring(0,20)}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
    }
  }, [])

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Side - Content */}
            <div className="flex-1 w-full lg:w-auto lg:min-w-[720px] max-w-[700px]">
              {/* Subheadline - Above headline */}
              <p className="text-lg md:text-xl text-black mb-4 font-inter text-left">
                The All-In-One Tool for Personal Trainers
              </p>

              {/* Headline */}
              <h1 ref={headlineRef} className="text-[50px] leading-[60px] font-bold mb-4 font-sen text-left" style={{ letterSpacing: "0px" }}>
                <span className="block">One place to manage your</span>
                <span className="text-black">clients</span>{" "}
                <span className="text-blue-400" style={{ color: "#60A5FA" }}>and</span>{" "}
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(to right, #60A5FA, #9333EA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  save time.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-[18px] leading-[29.3px] text-black mb-6 font-inter font-normal text-left max-w-[650px]" style={{ letterSpacing: "0px" }}>
                Create a trainer page that gets you found, deliver programs in a client app, and track progress without
                spreadsheet chaos.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {onDemoClick && (
                  <button
                    onClick={onDemoClick}
                    className="bg-white border-2 border-black text-black px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center font-inter"
                  >
                    <Play className="w-4 h-4" />
                    Demo
                  </button>
                )}
                {onStartFreeClick && (
                  <button
                    onClick={onStartFreeClick}
                    className="text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity font-inter"
                    style={{
                      background: "linear-gradient(to right, #A8E632, #D2FF28)",
                    }}
                  >
                    Start for FREE with 3 clients
                  </button>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {trainerProfiles.map((trainer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                    >
                      <Image
                        src={trainer.imageUrl}
                        alt={trainer.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-juice text-juice" />
                    ))}
                  </div>
                  <span className="text-gray-700 font-inter">Built together with trainers</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visuals (Laptop + Phone composite) */}
            <div className="flex-1 w-full lg:w-auto flex items-center justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full"
              >
                {/* Composite image container - laptop behind, phone in front overlapping */}
                {/* Based on design: laptop 642x423, phone 166x339 - laptop should be ~3.87x wider */}
                <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px]">
                  {/* Laptop - positioned behind, slightly to the right */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-2xl lg:max-w-3xl">
                    <div className="relative w-full aspect-[642/423]">
                      <Image
                        src={laptopImageUrl}
                        alt="MacBook Pro with dashboard"
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  </div>
                  {/* Phone - positioned in front, overlapping laptop's lower left corner */}
                  {/* Phone is ~26% of laptop width (166/642) */}
                  <div className="absolute -left-8 md:-left-4 lg:left-0 bottom-0 md:bottom-4 lg:bottom-8 w-32 md:w-36 lg:w-40 z-20">
                    <div className="relative w-full aspect-[166/339] drop-shadow-2xl">
                      {/* Use img tag for external SVG to avoid Next.js Image optimization issues */}
                      <img
                        src={phoneImageUrl}
                        alt="iPhone with mobile app"
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

