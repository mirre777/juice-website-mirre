"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomCodeProps {
  children: ReactNode
  className?: string
}

export function CustomCode({ children, className }: CustomCodeProps) {
  return (
    <code
      className={cn(
        "bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono",
        "border border-gray-200",
        className,
      )}
    >
      {children}
    </code>
  )
}

interface CustomPreProps {
  children: ReactNode
  className?: string
}

export function CustomPre({ children, className }: CustomPreProps) {
  return (
    <pre
      className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6",
        "border border-gray-700",
        className,
      )}
    >
      {children}
    </pre>
  )
}
