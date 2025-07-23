import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  isDarkBackground?: boolean
}

export function Logo({ className, isDarkBackground = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {isDarkBackground ? (
          <img src="/images/juiceNewLogoPrimeWhite.png" alt="Juice" className="h-8 w-auto" />
        ) : (
          <img src="/images/juiceNewLogoPrime.png" alt="Juice" className="h-8 w-auto" />
        )}
      </div>
    </div>
  )
}
