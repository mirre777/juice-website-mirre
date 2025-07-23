"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Linkedin, Link, Check } from "lucide-react"

interface SocialShareProps {
  title: string
  url: string
  excerpt?: string
}

export function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: excerpt || title,
    url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Share cancelled")
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link")
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 font-medium">Share:</span>

      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2 bg-transparent"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(twitterUrl, "_blank")}
        className="flex items-center gap-2"
      >
        <Twitter className="w-4 h-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(linkedinUrl, "_blank")}
        className="flex items-center gap-2"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>

      <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex items-center gap-2 bg-transparent">
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  )
}
