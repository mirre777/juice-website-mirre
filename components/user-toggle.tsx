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
  const toggleClasses = cn(
    "relative inline-flex h-10 w-44 items-center justify-center rounded-full p-1 transition-colors duration-200",
    isDarkBackground ? "bg-black border border-white" : "bg-white border border-black",
    className,
  )

  const buttonClasses = (active: boolean) =>
    cn(
      "flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 border-2 w-20",
      active
        ? isDarkBackground
          ? "bg-white text-black border-white shadow-lg"
          : "bg-black text-white border-white shadow-lg"
        : isDarkBackground
          ? "text-white hover:bg-zinc-800 border-transparent"
          : "text-black hover:bg-gray-100 border-transparent",
    )

  return (
    <div className={toggleClasses} id={id}>
      <Button
        variant="ghost"
        size="sm"
        className={buttonClasses(!isCoach)}
        onClick={() => onChange?.(false)}
        aria-pressed={!isCoach}
      >
        <User className="h-4 w-4" />
        Client
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={buttonClasses(isCoach || false)}
        onClick={() => onChange?.(true)}
        aria-pressed={isCoach}
      >
        <Dumbbell className="h-4 w-4" />
        Trainer
      </Button>
    </div>
  )
}
