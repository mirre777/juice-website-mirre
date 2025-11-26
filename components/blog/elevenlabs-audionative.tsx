"use client"

import { useEffect } from "react"
import Script from "next/script"

export function ElevenLabsAudioNative() {
  useEffect(() => {
    // Wait for content to be available before initializing
    const checkContent = () => {
      const articleContent = document.getElementById("article-content")
      if (articleContent && articleContent.textContent && articleContent.textContent.trim().length > 0) {
        console.log("Article content is available:", articleContent.textContent.substring(0, 100))
        return true
      }
      return false
    }

    // Check immediately
    if (checkContent()) {
      return
    }

    // If not available, wait for it
    const observer = new MutationObserver(() => {
      if (checkContent()) {
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
        console.log("Article content found after timeout")
      } else {
        console.warn("Article content not found after timeout")
      }
    }, 5000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <div
        id="elevenlabs-audionative-widget"
        data-height="90"
        data-width="100%"
        data-frameborder="no"
        data-scrolling="no"
        data-publicuserid="93e4e7453a2b1b2ff158da61919ff4bf5f46f4e83d756d8265f39187ed5e0b9c"
        data-playerurl="https://elevenlabs.io/player/index.html"
        data-content-selector="#article-content"
      >
        Loading the{" "}
        <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">
          Elevenlabs Text to Speech
        </a>{" "}
        AudioNative Player...
      </div>
      <Script
        id="elevenlabs-audionative-helper"
        src="https://elevenlabs.io/player/audioNativeHelper.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("ElevenLabs AudioNative script loaded")
          // Give the widget a moment to find the content
          setTimeout(() => {
            const articleContent = document.getElementById("article-content")
            if (articleContent) {
              console.log("Article content element found for widget:", articleContent)
            }
          }, 1000)
        }}
        onError={(e) => {
          console.error("Failed to load ElevenLabs AudioNative script:", e)
        }}
      />
    </>
  )
}

