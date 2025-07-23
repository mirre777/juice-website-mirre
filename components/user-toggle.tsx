"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function UserToggle() {
  const { isCoach, setIsCoach } = useTheme()

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
      <Button
        variant={!isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(false)}
        className={`rounded-full px-3 py-1 text-xs ${
          !isCoach ? "bg-black text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
        }`}
      >
        Client
      </Button>
      <Button
        variant={isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(true)}
        className={`rounded-full px-3 py-1 text-xs ${
          isCoach
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
        }`}
      >
        Trainer
      </Button>
    </div>
  )
}
