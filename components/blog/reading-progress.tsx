"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    const updateProgress = () => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return
      }

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(scrollPercent * 100)
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", updateProgress)
      }
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-juice z-50 transition-all duration-150"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
