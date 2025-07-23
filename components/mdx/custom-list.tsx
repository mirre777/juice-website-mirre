"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomListProps {
  ordered?: boolean
  children: ReactNode
  className?: string
}

export function CustomList({ ordered = false, children, className }: CustomListProps) {
  const ListTag = ordered ? "ol" : "ul"

  return (
    <ListTag className={cn("my-4 space-y-2", ordered ? "list-decimal list-inside pl-4" : "list-none pl-0", className)}>
      {children}
    </ListTag>
  )
}

interface CustomListItemProps {
  children: ReactNode
  className?: string
}

export function CustomListItem({ children, className }: CustomListItemProps) {
  return (
    <li
      className={cn(
        "relative pl-6 text-gray-700 leading-relaxed",
        "before:content-['→'] before:absolute before:left-0 before:text-juice before:font-bold",
        className,
      )}
    >
      {children}
    </li>
  )
}
