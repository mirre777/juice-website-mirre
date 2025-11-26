"use client"

import Script from "next/script"

export function ElevenLabsAudioNative() {
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
        strategy="afterInteractive"
        onLoad={() => {
          // Script has loaded, widget should initialize automatically
          console.log("ElevenLabs AudioNative script loaded")
        }}
        onError={(e) => {
          console.error("Failed to load ElevenLabs AudioNative script:", e)
        }}
      />
    </>
  )
}

