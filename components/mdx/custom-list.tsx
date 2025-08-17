"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomListProps {
  children: ReactNode
  ordered?: boolean
  className?: string
}

interface CustomListItemProps {
  children: ReactNode
  className?: string
}

export function CustomList({ children, ordered = false, className, ...props }: CustomListProps) {
  const ListTag = ordered ? "ol" : "ul"

  return (
    <ListTag className={cn("my-4 space-y-2", ordered ? "list-decimal list-inside" : "list-none", className)} {...props}>
      {children}
    </ListTag>
  )
}

export function CustomListItem({ children, className, ...props }: CustomListItemProps) {
  return (
    <li
      className={cn(
        "relative pl-6 before:content-['→'] before:absolute before:left-0 before:text-juice before:font-bold",
        "leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  )
}
