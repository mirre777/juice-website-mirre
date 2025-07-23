"use client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function UserToggle() {
  const { isCoach, setIsCoach } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={!isCoach ? "default" : "outline"}
        size="sm"
        onClick={() => setIsCoach(false)}
        className={`text-xs ${
          !isCoach ? "bg-orange-500 text-white hover:bg-orange-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Client
      </Button>
      <Button
        variant={isCoach ? "default" : "outline"}
        size="sm"
        onClick={() => setIsCoach(true)}
        className={`text-xs ${
          isCoach ? "bg-orange-500 text-white hover:bg-orange-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Trainer
      </Button>
    </div>
  )
}
