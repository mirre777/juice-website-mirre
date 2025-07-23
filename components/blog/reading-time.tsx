"use client"

import { Clock } from "lucide-react"

interface ReadingTimeProps {
  content: string
}

export function ReadingTime({ content }: ReadingTimeProps) {
  // Calculate reading time (average 200 words per minute)
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{readingTime} min read</span>
    </div>
  )
}
