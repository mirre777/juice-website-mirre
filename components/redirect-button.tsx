"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RedirectButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "juice"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RedirectButton({ children, className, variant = "default", size = "default" }: RedirectButtonProps) {
  const router = useRouter()

  const handleRedirect = () => {
    window.location.href = "https://app.juice.fitness/"
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleRedirect}>
      {children}
    </Button>
  )
}
