"use client"

import { useEffect, useRef } from "react"

export function ElevenLabsAudioNative() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait for widget div to be in DOM first, then wait for content
    const checkWidget = () => {
      const widget = document.querySelector("#elevenlabs-audionative-widget")
      return widget !== null
    }

    // Wait for article content to be available before loading script
    const checkContent = () => {
      const mdxContent = document.querySelector(".mdx-content")
      const articleContent = document.querySelector("article")
      
      // Check if we have substantial content
      const hasMdxContent = mdxContent && mdxContent.textContent && mdxContent.textContent.trim().length > 100
      const hasArticleContent = articleContent && articleContent.textContent && articleContent.textContent.trim().length > 100
      
      return hasMdxContent || hasArticleContent
    }

    // Check if script already exists
    if (document.querySelector('script[src*="audioNativeHelper.js"]')) {
      console.log("ElevenLabs AudioNative script already loaded")
      return
    }

    // Wait for both widget and content to be ready
    const loadScript = () => {
      if (!checkWidget()) {
        console.log("Widget not in DOM yet, waiting...")
        setTimeout(loadScript, 200)
        return
      }

      if (!checkContent()) {
        // If content not ready, wait a bit and try again
        setTimeout(loadScript, 500)
        return
      }

      // Both widget and content are ready, add delay to ensure full rendering
      setTimeout(() => {
        // Double-check content is still there and has substantial text
        const mdxContent = document.querySelector(".mdx-content")
        const articleContent = document.querySelector("article")
        
        const contentLength = mdxContent?.textContent?.length || articleContent?.textContent?.length || 0
        
        if (contentLength < 100) {
          console.warn("Content not substantial enough, waiting more...", { contentLength })
          setTimeout(loadScript, 1000)
          return
        }

        // Verify widget is definitely in DOM before loading script
        const widget = document.querySelector("#elevenlabs-audionative-widget")
        if (!widget) {
          console.error("Widget not found in DOM before script load!")
          setTimeout(loadScript, 500)
          return
        }

        // Content is ready, load the script
        const script = document.createElement("script")
        script.src = "https://elevenlabs.io/player/audioNativeHelper.js"
        script.async = false // Load synchronously to ensure widget is ready
        script.type = "text/javascript"
        
        // Store widget reference to check later
        const widgetElement = widget
        
        // Watch for changes to the widget (Audio Native might replace its content)
        const widgetObserver = new MutationObserver((mutations) => {
          const currentWidget = document.querySelector("#elevenlabs-audionative-widget")
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              console.log("Widget content changed - Audio Native might be initializing", {
                addedNodes: mutation.addedNodes.length,
                widgetExists: !!currentWidget,
                hasIframe: currentWidget?.querySelector('iframe') !== null
              })
            }
          })
        })
        
        if (widget) {
          widgetObserver.observe(widget, {
            childList: true,
            subtree: true,
            attributes: true
          })
        }
        
        // Add onload handler to verify script loaded
        script.onload = () => {
          // Re-check widget immediately
          const widgetCheck = document.querySelector("#elevenlabs-audionative-widget")
          console.log("ElevenLabs AudioNative script onload fired", {
            widgetInDOM: !!widgetCheck,
            widgetElementStillExists: !!widgetElement && document.body.contains(widgetElement),
            widgetRefCurrent: widgetRef.current !== null,
            widgetVisible: widgetCheck ? window.getComputedStyle(widgetCheck).display !== 'none' : false,
            hasIframe: widgetCheck?.querySelector('iframe') !== null
          })
          
          // Stop observing after a delay
          setTimeout(() => {
            widgetObserver.disconnect()
          }, 5000)
          
          // Give the script a moment to initialize
          setTimeout(() => {
            const widgetAfter = document.querySelector("#elevenlabs-audionative-widget")
            const parent = widgetRef.current?.parentElement
            const iframe = widgetAfter?.querySelector('iframe')
            const anyPlayer = parent?.querySelector('[id*="elevenlabs"], [class*="elevenlabs"], iframe')
            
            console.log("Widget state after script load (2s delay):", {
              widgetExists: !!widgetAfter,
              widgetRefExists: widgetRef.current !== null,
              parentElement: !!parent,
              iframeFound: !!iframe,
              anyPlayerFound: !!anyPlayer,
              innerHTML: widgetAfter?.innerHTML?.substring(0, 200),
              children: widgetAfter?.children?.length || 0,
              widgetDisplay: widgetAfter ? window.getComputedStyle(widgetAfter).display : 'N/A'
            })
            
            // If widget exists but has no iframe, Audio Native might not have initialized
            if (widgetAfter && !iframe && widgetAfter.children.length === 0) {
              console.warn("Widget exists but Audio Native player not initialized - checking if script is available")
              // Check if Audio Native global is available
              if ((window as any).ElevenLabsAudioNative) {
                console.log("ElevenLabsAudioNative global found")
              } else {
                console.warn("ElevenLabsAudioNative global not found - script might not have initialized properly")
              }
            }
          }, 2000)
        }
        
        script.onerror = (error) => {
          console.error("Failed to load ElevenLabs AudioNative script", error)
        }
        
        document.body.appendChild(script)

        console.log("ElevenLabs AudioNative script element added to DOM", {
          widgetInDOM: checkWidget(),
          widgetElement: widget,
          mdxContentLength: mdxContent?.textContent?.length || 0,
          articleContentLength: articleContent?.textContent?.length || 0,
          contentPreview: mdxContent?.textContent?.substring(0, 100) || articleContent?.textContent?.substring(0, 100) || "N/A"
        })
      }, 1000) // 1 second delay after both are detected
    }

    // Start checking - wait a bit for widget to render first
    setTimeout(() => {
      if (checkWidget() && checkContent()) {
        // Both already available, load immediately
        loadScript()
      } else {
        // Wait for widget and content with MutationObserver
        const observer = new MutationObserver(() => {
          if (checkWidget() && checkContent()) {
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
          if (checkWidget() && checkContent()) {
            loadScript() // Load if both are available
          } else {
            console.warn("ElevenLabs AudioNative: Widget or content not found after timeout", {
              widget: checkWidget(),
              content: checkContent()
            })
            loadScript() // Load anyway after timeout
          }
        }, 5000)
      }
    }, 100) // Small delay to ensure widget is rendered

    return () => {
      const existingScript = document.querySelector('script[src*="audioNativeHelper.js"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div
      ref={widgetRef}
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
      style={{ display: 'block', minHeight: '90px', width: '100%' }}
    >
      Loading the{" "}
      <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">
        Elevenlabs Text to Speech
      </a>{" "}
      AudioNative Player...
    </div>
  )
}

