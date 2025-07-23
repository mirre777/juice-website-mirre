"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function UserToggle() {
  const { isCoach, setIsCoach } = useTheme()

  return (
    <div className={`flex items-center rounded-full p-1 ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
      <Button
        variant={isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(true)}
        className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
          isCoach ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-zinc-700"
        }`}
      >
        Coach
      </Button>
      <Button
        variant={!isCoach ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsCoach(false)}
        className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
          !isCoach ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        Client
      </Button>
    </div>
  )
}
