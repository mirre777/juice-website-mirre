import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LinkButtonProps {
  children: React.ReactNode
  href: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "juice"
  size?: "default" | "sm" | "lg" | "icon"
  external?: boolean
}

export function LinkButton({
  children,
  href,
  className,
  variant = "default",
  size = "default",
  external = false,
}: LinkButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
      </Link>
    </Button>
  )
}
