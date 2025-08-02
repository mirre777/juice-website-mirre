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

  // Create professional LinkedIn post format
  const linkedInText = `${title}

${excerpt || title}

Read more: ${url}

#FitnessCoaching #PersonalTraining #FitnessTech`

  // Validate text length (LinkedIn has ~3000 char limit)
  const finalLinkedInText =
    linkedInText.length > 2800
      ? `${title}

${(excerpt || title).substring(0, 200)}...

Read more: ${url}

#FitnessCoaching #PersonalTraining #FitnessTech`
      : linkedInText

  const shareLinks = {
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(finalLinkedInText)}`,
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
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
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
      // Validate URL before opening
      if (!shareLinks.linkedin || shareLinks.linkedin.length > 8192) {
        console.error("LinkedIn URL too long or invalid")
        copyToClipboard()
        return
      }

      const newWindow = window.open(
        shareLinks.linkedin,
        "_blank",
        "noopener,noreferrer,width=600,height=600,scrollbars=yes,resizable=yes",
      )

      if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
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
