"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to declare the variable

interface CustomHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
  id?: string
}

export function CustomHeading({ level, children, className, id, ...props }: CustomHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  // Extract text content for ID generation
  const textContent = typeof children === "string" ? children : ""
  const headingId =
    id ||
    textContent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

  // Check if this is a TL;DR heading
  const isTldr = textContent.toLowerCase().includes("tl;dr")

  const baseClasses = {
    1: "text-4xl md:text-5xl font-bold mb-6 mt-8",
    2: "text-3xl md:text-4xl font-bold mb-4 mt-8 pb-2 border-b border-gray-200",
    3: "text-2xl md:text-3xl font-semibold mb-3 mt-6",
    4: "text-xl md:text-2xl font-semibold mb-3 mt-4",
    5: "text-lg md:text-xl font-semibold mb-2 mt-4",
    6: "text-base md:text-lg font-semibold mb-2 mt-3",
  }

  const emojiSpacingClass = "emoji-heading"

  return (
    <HeadingTag
      id={headingId}
      className={cn(
        baseClasses[level],
        emojiSpacingClass,
        isTldr && "text-juice",
        "scroll-mt-20 group relative",
        className,
      )}
      {...props}
    >
      {children}
      <a
        href={`#${headingId}`}
        className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-juice"
        aria-label="Link to this section"
      >
        #
      </a>
    </HeadingTag>
  )
}
