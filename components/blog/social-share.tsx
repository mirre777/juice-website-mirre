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
  const encodedUrl = encodeURIComponent(url)

  // LinkedIn sharing - use the simple share URL format that works better
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const handleLinkedInShare = () => {
    // Open LinkedIn share in a popup window for better UX
    const width = 600
    const height = 600
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    window.open(
      linkedinShareUrl,
      "linkedin-share",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )
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
