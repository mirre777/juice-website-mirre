"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Linkedin, Copy, Check } from "lucide-react"

interface SocialShareProps {
  title: string
  url: string
  excerpt?: string
}

export function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareText = excerpt || title
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(shareText)

  // OLD DEPRECATED METHOD - This is the problem!
  // const shareLinks = {
  //   linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`,
  // }

  // NEW MODERN METHOD - Using compose URL with pre-filled text
  const linkedInText = `${title}

${shareText}

Read more: ${url}

#FitnessCoaching #PersonalTraining #FitnessTech`

  const shareLinks = {
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInText)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea")
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr)
      }
    }
  }

  const handleLinkedInShare = () => {
    try {
      const newWindow = window.open(shareLinks.linkedin, "_blank", "noopener,noreferrer")
      if (!newWindow) {
        // Popup blocked - fallback to copying URL
        console.warn("LinkedIn sharing popup blocked, falling back to copy URL")
        copyToClipboard()
      }
    } catch (error) {
      console.error("LinkedIn sharing failed:", error)
      // Fallback to copying URL
      copyToClipboard()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-2">Share:</span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLinkedInShare}
        className="flex items-center gap-2 bg-transparent"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2 bg-transparent">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
      </Button>
    </div>
  )
}
