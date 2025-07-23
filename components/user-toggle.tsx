"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

export function UserToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
      <Button
        variant={theme === "client" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("client")}
        className="text-xs"
      >
        Client
      </Button>
      <Button
        variant={theme === "coach" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("coach")}
        className="text-xs"
      >
        Coach
      </Button>
    </div>
  )
}
