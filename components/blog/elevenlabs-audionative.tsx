"use client"

import { useEffect } from "react"

export function ElevenLabsAudioNative() {
  useEffect(() => {
    // Wait for MDX content to be available before loading script
    const checkContent = () => {
      const mdxContent = document.querySelector(".mdx-content")
      return mdxContent && mdxContent.textContent && mdxContent.textContent.trim().length > 0
    }

    // Check if script already exists
    if (document.querySelector('script[src*="audioNativeHelper.js"]')) {
      return
    }

    // Wait for content to be ready
    const loadScript = () => {
      if (!checkContent()) {
        // If content not ready, wait a bit and try again
        setTimeout(loadScript, 500)
        return
      }

      // Content is ready, add additional delay to ensure it's fully rendered
      setTimeout(() => {
        // Double-check content is still there and has substantial text
        const mdxContent = document.querySelector(".mdx-content")
        if (!mdxContent || !mdxContent.textContent || mdxContent.textContent.trim().length < 100) {
          console.warn("MDX content not substantial enough, waiting more...")
          setTimeout(loadScript, 1000)
          return
        }

        // Content is ready, load the script
        const script = document.createElement("script")
        script.src = "https://elevenlabs.io/player/audioNativeHelper.js"
        script.async = true
        script.type = "text/javascript"
        document.body.appendChild(script)

        console.log("ElevenLabs AudioNative script loaded after content ready", {
          contentLength: mdxContent.textContent.length,
          contentPreview: mdxContent.textContent.substring(0, 100)
        })
      }, 2000) // 2 second delay after content is detected to ensure full rendering
    }

    // Start checking for content
    if (checkContent()) {
      // Content already available, load immediately
      loadScript()
    } else {
      // Wait for content with MutationObserver
      const observer = new MutationObserver(() => {
        if (checkContent()) {
          observer.disconnect()
          loadScript()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect()
        loadScript() // Load anyway after timeout
      }, 3000)
    }

    return () => {
      const existingScript = document.querySelector('script[src*="audioNativeHelper.js"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

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
      data-small="True"
      data-textcolor="rgba(0, 0, 0, 1.0)"
      data-backgroundcolor="rgba(255, 255, 255, 1.0)"
    >
      Loading the{" "}
      <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">
        Elevenlabs Text to Speech
      </a>{" "}
      AudioNative Player...
    </div>
  )
}

