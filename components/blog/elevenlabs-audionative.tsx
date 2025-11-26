"use client"

import { useEffect, useState } from "react"

export function ElevenLabsAudioNative() {
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    // Wait for MDX content to be available
    const checkContent = () => {
      const mdxContent = document.querySelector(".mdx-content")
      if (mdxContent && mdxContent.textContent && mdxContent.textContent.trim().length > 0) {
        console.log("MDX content is available:", mdxContent.textContent.substring(0, 100))
        return true
      }
      return false
    }

    // Check immediately
    if (checkContent()) {
      setContentReady(true)
      return
    }

    // If not available, wait for it with MutationObserver
    const observer = new MutationObserver(() => {
      if (checkContent()) {
        setContentReady(true)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Fallback timeout
    const timeout = setTimeout(() => {
      observer.disconnect()
      if (checkContent()) {
        setContentReady(true)
        console.log("MDX content found after timeout")
      } else {
        console.warn("MDX content not found after timeout - loading widget anyway")
        setContentReady(true) // Load anyway after timeout
      }
    }, 2000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!contentReady) return

    // Add a delay to ensure content is fully rendered
    const timer = setTimeout(() => {
      // Check if script already exists
      if (document.querySelector('script[src*="audioNativeHelper.js"]')) {
        console.log("ElevenLabs script already loaded")
        return
      }

      const script = document.createElement("script")
      script.src = "https://elevenlabs.io/player/audioNativeHelper.js"
      script.async = true
      script.type = "text/javascript"
      document.body.appendChild(script)

      console.log("ElevenLabs AudioNative script loaded after content ready")
    }, 1000) // 1 second delay after content is ready

    return () => {
      clearTimeout(timer)
      const existingScript = document.querySelector('script[src*="audioNativeHelper.js"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [contentReady])

  return (
    <div
      id="elevenlabs-audionative-widget"
      data-height="90"
      data-width="100%"
      data-frameborder="no"
      data-scrolling="no"
      data-publicuserid="93e4e7453a2b1b2ff158da61919ff4bf5f46f4e83d756d8265f39187ed5e0b9c"
      data-playerurl="https://elevenlabs.io/player/index.html"
      data-content-selector=".mdx-content"
    >
      Loading the{" "}
      <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">
        Elevenlabs Text to Speech
      </a>{" "}
      AudioNative Player...
    </div>
  )
}

