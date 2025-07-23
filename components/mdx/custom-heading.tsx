"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to declare the variable

interface CustomHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
}

export function CustomHeading({ level, children, className }: CustomHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  // Extract emojis and text for better styling
  const childrenString = children?.toString() || ""
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
  const hasEmoji = emojiRegex.test(childrenString)

  // Check if this is a TL;DR section
  const isTLDR = childrenString.toLowerCase().includes("tl;dr")

  const baseStyles = {
    1: "text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight",
    2: "text-2xl md:text-3xl font-bold mb-4 mt-8 text-gray-900 leading-tight",
    3: "text-xl md:text-2xl font-semibold mb-3 mt-6 text-gray-800 leading-tight",
    4: "text-lg md:text-xl font-semibold mb-2 mt-4 text-gray-800",
    5: "text-base md:text-lg font-semibold mb-2 mt-4 text-gray-700",
    6: "text-sm md:text-base font-semibold mb-2 mt-4 text-gray-700",
  }

  const emojiStyles = hasEmoji ? "emoji-heading" : ""
  const tldrStyles = isTLDR ? "tldr-heading" : ""

  return (
    <>
      <HeadingTag
        className={cn(baseStyles[level], emojiStyles, tldrStyles, className)}
        id={childrenString
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}
      >
        {children}
      </HeadingTag>
      {level === 2 && !isTLDR && <div className="w-16 h-1 bg-juice mb-6 rounded-full" />}
    </>
  )
}
