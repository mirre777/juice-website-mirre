"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import { Dumbbell } from "lucide-react"

interface UserToggleProps {
  isCoach?: boolean
  onChange?: (isCoach: boolean) => void
  className?: string
  id?: string
  isDarkBackground?: boolean
}

export function UserToggle({ isCoach, onChange, className, id, isDarkBackground = false }: UserToggleProps) {
  const containerClasses = cn(
    "relative inline-flex h-10 w-44 items-center rounded-full border transition-colors duration-200 overflow-hidden",
    isDarkBackground ? "border-white/30" : "border-black",
    className,
  )

  return (
    <div className={containerClasses} id={id}>
      <button
        type="button"
        className={cn(
          "flex items-center justify-center gap-2 h-full flex-1 text-sm font-semibold transition-all duration-200",
          !isCoach
            ? "bg-black text-white"
            : "bg-white text-black",
        )}
        onClick={() => onChange?.(false)}
        aria-pressed={!isCoach}
      >
        <User className="h-4 w-4" />
        <span className={cn(
          !isCoach && "underline decoration-2 decoration-lime-500 underline-offset-2"
        )}>
          Client
        </span>
      </button>
      <button
        type="button"
        className={cn(
          "flex items-center justify-center gap-2 h-full flex-1 text-sm font-semibold transition-all duration-200",
          isCoach
            ? "bg-black text-white"
            : "bg-white text-black",
        )}
        onClick={() => onChange?.(true)}
        aria-pressed={isCoach}
      >
        <Dumbbell className="h-4 w-4" />
        <span className={cn(
          isCoach && "underline decoration-2 decoration-lime-500 underline-offset-2"
        )}>
          Trainer
        </span>
      </button>
    </div>
  )
}
