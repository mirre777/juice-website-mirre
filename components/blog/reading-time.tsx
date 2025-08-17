"use client"

import { Clock } from "lucide-react"

interface ReadingTimeProps {
  content: string
}

export function ReadingTime({ content }: ReadingTimeProps) {
  // Default reading speed (words per minute)
  const wordsPerMinute = 200

  // Calculate reading time
  const getReadingTime = (text: string) => {
    if (!text) return 1 // Default to 1 minute if no content

    // Count words (split by spaces)
    const words = text.trim().split(/\s+/).length

    // Calculate minutes
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))

    return minutes
  }

  const minutes = getReadingTime(content)

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{minutes} min read</span>
    </div>
  )
}
