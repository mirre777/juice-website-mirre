"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomCodeProps {
  children: ReactNode
  className?: string
}

interface CustomPreProps {
  children: ReactNode
  className?: string
}

export function CustomCode({ children, className, ...props }: CustomCodeProps) {
  return (
    <code
      className={cn(
        "bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono",
        "border border-gray-200",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function CustomPre({ children, className, ...props }: CustomPreProps) {
  return (
    <pre
      className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6",
        "border border-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  )
}
