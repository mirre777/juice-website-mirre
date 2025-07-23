"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomParagraphProps {
  children: ReactNode
  className?: string
}

export function CustomParagraph({ children, className }: CustomParagraphProps) {
  const childrenString = children?.toString() || ""

  // Check if this is a TL;DR paragraph
  const isTLDR = childrenString.toLowerCase().startsWith("tl;dr")

  if (isTLDR) {
    return (
      <div
        className={cn(
          "bg-juice/10 border-l-4 border-juice p-4 my-6 rounded-r-lg",
          "relative overflow-hidden",
          className,
        )}
      >
        <div className="absolute top-2 right-2 text-juice opacity-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <p className="text-gray-800 font-medium leading-relaxed m-0">{children}</p>
      </div>
    )
  }

  return <p className={cn("text-gray-700 leading-relaxed mb-4 text-base md:text-lg", className)}>{children}</p>
}
