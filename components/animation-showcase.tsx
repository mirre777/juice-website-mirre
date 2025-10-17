"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function AnimationShowcase() {
  const { isCoach } = useTheme()
  const [selectedAnimation, setSelectedAnimation] = useState<string>("checkCircle")
  const [isPlaying, setIsPlaying] = useState(false)

  const bgColor = isCoach ? "bg-white" : "bg-zinc-900"
  const textColor = isCoach ? "text-black" : "text-white"
  const borderColor = isCoach ? "border-gray-200" : "border-zinc-700"

  const playAnimation = () => {
    setIsPlaying(false)
    // Force a re-render to restart the animation
    setTimeout(() => setIsPlaying(true), 10)
  }

  const renderSuccessAnimation = () => {
    const animation = successAnimations[selectedAnimation as keyof typeof successAnimations]

    if (!animation || !isPlaying) return null

    return (
      <div className="py-4 text-center">
        <motion.div
          className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
          initial={animation.container.initial}
          animate={animation.container.animate}
          transition={animation.container.transition}
        >
          <motion.div
            initial={animation.icon.initial}
            animate={animation.icon.animate}
            transition={animation.icon.transition}
          >
            <CheckCircle className="h-8 w-8 text-green-500" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={animation.text.initial}
          animate={animation.text.animate}
          transition={animation.text.transition}
        >
          <h3 className={`text-lg font-bold mb-1 ${textColor}`}>Success!</h3>
          <p className="text-zinc-400 text-sm">Your action was completed successfully.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-xl border ${borderColor} ${bgColor}`}>
      <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Animation Showcase</h2>

      <div className="mb-6">
        <label className={`block mb-2 ${textColor}`}>Select Animation:</label>
        <select
          value={selectedAnimation}
          onChange={(e) => setSelectedAnimation(e.target.value)}
          className={`w-full p-2 rounded-md ${isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700"} ${textColor}`}
        >
          <option value="checkCircle">Check Circle</option>
          <option value="pulse">Pulse</option>
          <option value="slideFromTop">Slide From Top</option>
          <option value="fadeScale">Fade Scale</option>
          <option value="bounce">Bounce</option>
        </select>
      </div>

      <Button onClick={playAnimation} className="trainer-gradient-btn mb-6">
        Play Animation
      </Button>

      <div className={`p-4 rounded-lg border ${borderColor} min-h-[200px] flex items-center justify-center`}>
        {renderSuccessAnimation()}
      </div>

      <div className="mt-4 text-sm text-zinc-500">
        <p>
          Animation: <code>{selectedAnimation}</code>
        </p>
        <p className="mt-1">
          Import from: <code>@/utils/animations</code>
        </p>
      </div>
    </div>
  )
}
