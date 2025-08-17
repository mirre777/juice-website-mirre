"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomParagraphProps {
  children: ReactNode
  className?: string
}

export function CustomParagraph({ children, className, ...props }: CustomParagraphProps) {
  // Check if this paragraph contains TL;DR content
  const textContent = typeof children === "string" ? children : ""
  const isTldr = textContent.toLowerCase().startsWith("tl;dr")

  if (isTldr) {
    return (
      <div
        className={cn(
          "bg-juice/10 border-l-4 border-juice p-4 my-6 rounded-r-lg",
          "font-medium text-gray-800",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-2">
          <span className="text-juice font-bold text-sm uppercase tracking-wide">TL;DR</span>
          <div className="flex-1">{typeof children === "string" ? children.replace(/^tl;dr:?\s*/i, "") : children}</div>
        </div>
      </div>
    )
  }

  return (
    <p className={cn("mb-4 leading-relaxed text-gray-700", className)} {...props}>
      {children}
    </p>
  )
}
