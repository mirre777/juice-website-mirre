"use client"

import { Clock } from "lucide-react"

interface ReadingTimeProps {
  content: string
}

export function ReadingTime({ content }: ReadingTimeProps) {
  // Calculate reading time (average 200 words per minute)
  const wordsPerMinute = 200
  const wordCount = content ? content.split(/\s+/).length : 0
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{readingTime} min read</span>
    </div>
  )
}
